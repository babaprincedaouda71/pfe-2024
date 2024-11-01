package org.example.invoicingservice;

import org.example.invoicingservice.client.ClientRest;
import org.example.invoicingservice.client.TrainingRest;
import org.example.invoicingservice.client.VendorRest;
import org.example.invoicingservice.entity.Invoice;
import org.example.invoicingservice.enums.InvoiceStatus;
import org.example.invoicingservice.enums.InvoiceType;
import org.example.invoicingservice.model.Client;
import org.example.invoicingservice.model.Training;
import org.example.invoicingservice.model.Vendor;
import org.example.invoicingservice.repo.InvoiceRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.util.List;

@SpringBootApplication
@EnableFeignClients
public class InvoicingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(InvoicingServiceApplication.class, args);
    }

//    @Bean
//    CommandLineRunner start(InvoiceRepo invoiceRepo,
//                            TrainingRest trainingRest,
//                            ClientRest clientRest,
//                            VendorRest vendorRest) {
//        return args -> {
//            Client client = clientRest.findClientById(1L);
//            Vendor vendor = vendorRest.findVendorById(1L);
//            Training training = trainingRest.findTrainingById(1L);
//
//            Invoice standardInvoice = Invoice.builder()
//                    .numberInvoice("2406-001")
//                    .createdAt("2024-06-03")
//                    .idClient(client.getIdClient())
//                    .client(clientRest.findClientById(client.getIdClient()))
//                    .ht(2500d)
//                    .tva(0.2f)
//                    .ttc(2500d * 0.2f)
//                    .editor("Baba Prince")
//                    .status(InvoiceStatus.Réglée)
//                    .deadline(15)
//                    .expired(false)
//                    .paymentDate("2024-06-03")
//                    .invoiceType(InvoiceType.standard)
//                    .paymentMethod("Virement")
//                    .build();
//            invoiceRepo.save(standardInvoice);
//
////            Invoice trainingInvoice = Invoice.builder()
////                    .numberInvoice("FF-2405-002")
////                    .createdAt("2024-05-31")
////                    .idClient(2L)
////                    .client(clientRest.findClientById(2L))
////                    .ht(25000d)
////                    .tva(0.2f)
////                    .ttc(25000d * 0.2f)
////                    .editor("Baba Prince")
////                    .invoiceType(InvoiceType.trainingModule)
////                    .paymentMethod("Virement")
////                    .trainingIds(List.of(2L))
////                    .status(InvoiceStatus.Non_Réglée)
////                    .build();
////
////            invoiceRepo.save(trainingInvoice);
//        };
//    }

}
