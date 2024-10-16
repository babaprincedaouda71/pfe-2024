package org.example.invoicingservice.service;

import org.example.invoicingservice.entity.Invoice;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface InvoiceService {
    Invoice saveStandardInvoice(Invoice invoice);

    Invoice saveTrainingInvoice(Invoice invoice);

    Invoice saveGroupsInvoice(Invoice invoice);

    Invoice updateGroupsInvoice(Invoice invoice, Long idInvoice);

    List<Invoice> findAllInvoices();

    Invoice findInvoiceById(Long idInvoice);

    Invoice findInvoiceByInvoiceNumber(String invoiceNumber);

    boolean findInvoiceNumber(String invoiceNumber);

    Invoice updateStandardInvoice(Long idInvoice, Invoice invoice);

    Invoice updateTrainingInvoice(Long idInvoice, Invoice invoice);

    void deleteInvoice(Long idInvoice);

    Invoice updateStatus(String invoiceData, MultipartFile cheque, MultipartFile copyRemise);

    String generateNewInvoiceNumber(int year, int month);
}
