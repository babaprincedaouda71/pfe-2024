package org.example.invoicingservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import org.example.invoicingservice.client.ClientRest;
import org.example.invoicingservice.client.TrainingRest;
import org.example.invoicingservice.entity.Invoice;
import org.example.invoicingservice.enums.InvoiceStatus;
import org.example.invoicingservice.enums.InvoiceType;
import org.example.invoicingservice.model.Client;
import org.example.invoicingservice.model.Product;
import org.example.invoicingservice.model.Training;
import org.example.invoicingservice.repo.InvoiceRepo;
import org.example.invoicingservice.repo.ProductRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class InvoiceServiceImpl implements InvoiceService {
  private final InvoiceRepo invoiceRepo;
  private final ClientRest clientRest;
  private final TrainingRest trainingRest;
  private final ProductRepo productRepo;
  private double total;
  private float tva;

  public InvoiceServiceImpl(
      InvoiceRepo invoiceRepo,
      ClientRest clientRest,
      TrainingRest trainingRest,
      ProductRepo productRepo) {
    this.invoiceRepo = invoiceRepo;
    this.clientRest = clientRest;
    this.trainingRest = trainingRest;
    this.productRepo = productRepo;
  }

  @Override
  public Invoice saveStandardInvoice(Invoice invoice) {
    List<Product> productList = new ArrayList<>();
    Client client = clientRest.findClientById(invoice.getIdClient());
    if (invoice.getNumberInvoice() == null) {
      invoice.setNumberInvoice(generateInvoiceNumber("standard"));
    }
    invoice
        .getProducts()
        .forEach(
            product -> {
              product.setInvoice(invoice);
              productList.add(product);
              invoice.setTtc(
                  product.getUnitPrice() * product.getQuantity()
                      + ((product.getQuantity() * product.getUnitPrice()) * 0.2));
            });
    invoice.setClient(client);
    invoice.setProducts(productList);
    invoice.setInvoiceType(InvoiceType.standard);
    invoice.setDeadline(invoice.getClient().getDeadline());
    invoice.setStatus(InvoiceStatus.Non_Réglée);
    Invoice savedInvoice = invoiceRepo.save(invoice);
    productRepo.saveAll(productList);
    return invoiceRepo.save(savedInvoice);
  }

  @Override
  public Invoice saveTrainingInvoice(Invoice invoice) {
    LocalDate createdAt = LocalDate.now();
    invoice.setNumberInvoice(generateInvoiceNumber("training"));
    invoice.setCreatedAt(createdAt.toString());
    invoice.setInvoiceType(InvoiceType.trainingModule);
    Client client = clientRest.findClientById(invoice.getIdClient());
    invoice.setDeadline(client.getDeadline());
    System.out.println(invoice.getTrainings());
    if (invoice.getTrainings() != null) {
      invoice.setTrainingIds(
          invoice.getTrainings().stream()
              .map(Training::getIdTraining)
              .collect(Collectors.toList()));
      invoice
          .getTrainings()
          .forEach(
              training -> {
                invoice.setTtc(training.getAmount());
              });
    }
    invoice.setIdClient(invoice.getIdClient());
    invoice.setStatus(InvoiceStatus.Non_Réglée);
    return invoiceRepo.save(invoice);
  }

  @Override
  public Invoice saveGroupsInvoice(Invoice invoice) {
    double total = 0d;
    LocalDate createdAt = LocalDate.now();
    //    invoice.setNumberInvoice(generateInvoiceNumber("training"));
    invoice.setCreatedAt(invoice.getCreatedAt());
    invoice.setInvoiceType(InvoiceType.groupInvoice);
    Client client = clientRest.findClientById(invoice.getIdClient());
    invoice.setDeadline(client.getDeadline());
    if (invoice.getTrainings() != null) {
      invoice.setTrainingIds(
          invoice.getTrainings().stream()
              .map(Training::getIdTraining)
              .collect(Collectors.toList()));
      invoice
          .getTrainings()
          .forEach(
              training -> {
                this.total += training.getAmount();

                // Marquer le groupe comme facturé
                training.getGroups().forEach(group -> {
//                  group.setInvoiced(true);
//                  trainingRest.markGroupAsInvoiced(group);
                });
              });
      invoice.setHt(invoice.getHt() + invoice.getTravelFees());
      invoice.setTva((invoice.getTva()));
      invoice.setTravelFees(invoice.getTravelFees());
      invoice.setTtc(invoice.getTtc());
    }
    invoice.setIdClient(invoice.getIdClient());
    invoice.setStatus(InvoiceStatus.Non_Réglée);
    return invoiceRepo.save(invoice);
  }


  @Override
  public Invoice updateGroupsInvoice(Invoice invoice, Long idInvoice) {
    Invoice byId = invoiceRepo.findById(idInvoice).orElseThrow(() -> new RuntimeException("Invoice not found"));

    return invoiceRepo.save(invoice);
  }

  @Override
  public List<Invoice> findAllInvoices() {
    List<Training> trainingList = new ArrayList<>();
    List<Invoice> all = invoiceRepo.findAll();
    if (all.isEmpty()) {
      System.out.println("No invoices found");
    }
    all.forEach(
        invoice -> {
          Client client = clientRest.findClientById(invoice.getIdClient());
          if (invoice.getTrainings() == null) {
            invoice
                .getTrainingIds()
                .forEach(
                    trainingId -> {
                      if (trainingId != null) {
                        Training training = trainingRest.findTrainingById(trainingId);
                        System.out.println(training);
                        trainingList.add(training);
                      }
                    });
          }
          invoice.setClient(client);
          invoice.setTrainings(trainingList);
        });
    return all;
  }

  @Override
  public Invoice findInvoiceById(Long idInvoice) {
    Invoice invoice =
        invoiceRepo
            .findById(idInvoice)
            .orElseThrow(() -> new EntityNotFoundException("Invoice not found"));
    feignClients(invoice);
    feignTrainings(invoice);
    return invoice;
  }

  @Override
  public Invoice findInvoiceByInvoiceNumber(String numberInvoice) {
    Invoice byNumberInvoice = invoiceRepo.findByNumberInvoice(numberInvoice);
    feignClients(byNumberInvoice);
    return byNumberInvoice;
  }

  @Override
  public boolean findInvoiceNumber(String numberInvoice) {
    Invoice invoice = invoiceRepo.findNumberInvoice(numberInvoice);
    return invoice != null;
  }

  @Override
  public Invoice updateStandardInvoice(Long idInvoice, Invoice invoice) {
    Invoice found =
        invoiceRepo
            .findById(idInvoice)
            .orElseThrow(() -> new EntityNotFoundException("Invoice not found"));

    // Remove existing products associated with the invoice
    productRepo.deleteByInvoice(found);

    if (!invoice.getProducts().isEmpty()) {
      List<Product> productList = new ArrayList<>();
      double totalTtc = 0;
      for (Product product : invoice.getProducts()) {
        product.setInvoice(found);
        productList.add(product);
        totalTtc +=
            product.getUnitPrice()
                * product.getQuantity()
                * 1.2; // calculate TTC for each product and sum it up
      }
      found.setProducts(productList);
      found.setTtc(totalTtc); // set the total TTC for the invoice
    }

    return invoiceRepo.save(found);
  }

  @Override
  public Invoice updateTrainingInvoice(Long idInvoice, Invoice invoice) {
    Invoice found =
        invoiceRepo
            .findById(idInvoice)
            .orElseThrow(() -> new EntityNotFoundException("Invoice not found"));

    if (invoice.getTrainings() != null) {
      found.getTrainingIds().clear();
      List<Long> trainingIds = new ArrayList<>();
      for (Training training : invoice.getTrainings()) {
        trainingIds.add(training.getIdTraining());
      }
      found.setTrainingIds(trainingIds);
      found.setProducts(null);
    }
    found.setInvoiceType(InvoiceType.trainingModule);
    Invoice saved = invoiceRepo.save(found);
    if (saved.getTrainings() == null) {
      List<Training> trainingList = new ArrayList<>();
      saved
          .getTrainingIds()
          .forEach(
              aLong -> {
                Training training = trainingRest.findTrainingById(aLong);
                trainingList.add(training);
              });
      saved.setTrainings(trainingList);
      System.out.println(saved.getTrainings());
    }
    return saved;
  }

  @Override
  public void deleteInvoice(Long idInvoice) {
    invoiceRepo.deleteById(idInvoice);
  }

  @Override
  public Invoice updateStatus(String invoiceData, MultipartFile cheque, MultipartFile copyRemise) {
    ObjectMapper objectMapper = new ObjectMapper();
    try {
      Invoice invoice = objectMapper.readValue(invoiceData, Invoice.class);
      if (cheque != null) {
        invoice.setCheque(cheque.getBytes());
      }
      if (copyRemise != null) {
        invoice.setCopyRemise(copyRemise.getBytes());
      }
      if (!invoice.getProducts().isEmpty()) {
        List<Product> productList = new ArrayList<>();
        invoice
            .getProducts()
            .forEach(
                product -> {
                  product.setInvoice(invoice);
                  productList.add(product);
                });
        invoice.setProducts(productList);
        invoice.setInvoiceType(InvoiceType.standard);
      } else {
        invoice.setInvoiceType(InvoiceType.trainingModule);
      }
      Invoice saved = invoiceRepo.save(invoice);

      if (saved.getTrainings() == null) {
        List<Training> trainingList = new ArrayList<>();
        saved
            .getTrainingIds()
            .forEach(
                aLong -> {
                  Training training = trainingRest.findTrainingById(aLong);
                  trainingList.add(training);
                });
        saved.setTrainings(trainingList);
      }

      return saved;
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  /***************************************************************************/
  private void feignTrainings(Invoice invoice) {
    List<Training> trainingList = new ArrayList<>();
    if (invoice.getTrainingIds() != null) {
      invoice
          .getTrainingIds()
          .forEach(
              trainingId -> {
                Training training = trainingRest.findTrainingById(trainingId);
                trainingList.add(training);
              });
      invoice.setTrainings(trainingList);
    }
  }

  private void feignClients(Invoice invoice) {
    if (invoice.getIdClient() != null) {
      invoice.setClient(clientRest.findClientById(invoice.getIdClient()));
    }
  }

  public String generateInvoiceNumber(String type) {
    // Récupérer l'année et le mois en cours
    LocalDate now = LocalDate.now();
    String year = String.valueOf(now.getYear()).substring(2);
    String month = String.format("%02d", now.getMonthValue());
    String numberInvoice = "";

    // Obtenir le prochain ID disponible dans la base de données
    int nextId = invoiceRepo.findNextId();

    // Créer le numéro de facture avec le format FS-AAMM-00X
    if (type.equals("standard")) {
      numberInvoice = String.format("FS-%s%s-%03d", year, month, nextId);
    }
    if (type.equals("training")) {
      numberInvoice = String.format("FF-%s%s-%03d", year, month, nextId);
    }

    return numberInvoice;
  }

  @Override
  public String generateNewInvoiceNumber(int year, int month) {
    String yearMonth = String.format("%02d%02d", year % 100, month);
    List<Invoice> invoices = invoiceRepo.findInvoicesByYearAndMonth(yearMonth);

    int newInvoiceNumber =
        invoices.stream()
            .findFirst()
            .map(
                invoice -> {
                  String lastNum = invoice.getNumberInvoice();
                  return Integer.parseInt(lastNum.substring(7)) + 1;
                })
            .orElse(1); // Si aucune facture n'existe, commencer à 1

    return String.format("%02d%02d-%03d", year % 100, month, newInvoiceNumber);
  }
}
