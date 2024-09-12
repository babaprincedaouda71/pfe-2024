package org.example.invoicingservice.repo;

import org.example.invoicingservice.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceRepo extends JpaRepository<Invoice, Long> {
    Invoice findByNumberInvoice(String invoiceNumber);

    @Query("SELECT i FROM Invoice i WHERE i.numberInvoice = :numberInvoice")
    Invoice findNumberInvoice(String numberInvoice);

    @Query("SELECT COALESCE(MAX(i.idInvoice) + 1, 1) FROM Invoice i")
    int findNextId();
}
