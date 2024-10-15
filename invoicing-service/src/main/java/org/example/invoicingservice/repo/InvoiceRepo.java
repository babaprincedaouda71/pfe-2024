package org.example.invoicingservice.repo;

import org.example.invoicingservice.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepo extends JpaRepository<Invoice, Long> {
    Invoice findByNumberInvoice(String invoiceNumber);

    @Query("SELECT i FROM Invoice i WHERE i.numberInvoice = :numberInvoice")
    Invoice findNumberInvoice(String numberInvoice);

    @Query("SELECT COALESCE(MAX(i.idInvoice) + 1, 1) FROM Invoice i")
    int findNextId();

    // Récupérer la dernière facture du mois et de l'année triée par numInvoice
    @Query("SELECT i FROM Invoice i WHERE SUBSTRING(i.numberInvoice, 1, 4) = ?1 ORDER BY i.numberInvoice DESC")
    List<Invoice> findInvoicesByYearAndMonth(String yearMonth);
}
