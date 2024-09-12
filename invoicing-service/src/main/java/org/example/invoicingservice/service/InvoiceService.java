package org.example.invoicingservice.service;

import org.example.invoicingservice.entity.Invoice;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface InvoiceService {
    Invoice saveStandardInvoice(Invoice invoice);

    Invoice saveTrainingInvoice(Invoice invoice);

    List<Invoice> findAllInvoices();

    Invoice findInvoiceById(Long idInvoice);

    Invoice findInvoiceByInvoiceNumber(String invoiceNumber);

    boolean findInvoiceNumber(String invoiceNumber);

    Invoice updateStandardInvoice(Long idInvoice, Invoice invoice);

    Invoice updateTrainingInvoice(Long idInvoice, Invoice invoice);

    void deleteInvoice(Long idInvoice);

    Invoice updateStatus(String invoiceData, MultipartFile cheque, MultipartFile copyRemise);
}
