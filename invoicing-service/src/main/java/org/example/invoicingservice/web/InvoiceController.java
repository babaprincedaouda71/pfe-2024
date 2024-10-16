package org.example.invoicingservice.web;

import org.example.invoicingservice.entity.Invoice;
import org.example.invoicingservice.service.InvoiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/invoice")
public class InvoiceController {
    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @PostMapping("/add/standard")
    @PreAuthorize("hasAuthority('admin')")
    Invoice addStandardInvoice(@RequestBody Invoice invoice) {
        return invoiceService.saveStandardInvoice(invoice);
    }

    @PostMapping("/add/training")
    @PreAuthorize("hasAuthority('admin')")
    Invoice addInvoice(@RequestBody Invoice invoice) {
        return invoiceService.saveTrainingInvoice(invoice);
    }

    @PostMapping("/add/group-invoice")
    @PreAuthorize("hasAuthority('admin')")
    Invoice addGroupsInvoice(@RequestBody Invoice invoice) {
        return invoiceService.saveGroupsInvoice(invoice);
    }

    @PostMapping("/update/group-invoice/{idInvoice}")
    @PreAuthorize("hasAuthority('admin')")
    Invoice updateGroupsInvoice(@RequestBody Invoice invoice, @PathVariable Long idInvoice) {
        return invoiceService.updateGroupsInvoice(invoice, idInvoice);
    }

    @GetMapping("/find/all")
    @PreAuthorize("hasAnyAuthority('admin','user')")
    List<Invoice> findAll() {
        return invoiceService.findAllInvoices();
    }

    @GetMapping("/find/id/{idInvoice}")
    @PreAuthorize("hasAnyAuthority('admin','user')")
    Invoice findInvoiceById(@PathVariable Long idInvoice) {
        return invoiceService.findInvoiceById(idInvoice);
    }

    @GetMapping("/find/byNumber/{numberInvoice}")
    @PreAuthorize("hasAnyAuthority('admin','user')")
    Invoice findInvoiceByNumber(@PathVariable String numberInvoice) {
        return invoiceService.findInvoiceByInvoiceNumber(numberInvoice);
    }

    @GetMapping("/find/number/{numberInvoice}")
    @PreAuthorize("hasAnyAuthority('admin','user')")
    boolean findInvoiceNumber(@PathVariable String numberInvoice) {
        return invoiceService.findInvoiceNumber(numberInvoice);
    }


    @PutMapping("/update/standard/{idInvoice}")
    @PreAuthorize("hasAuthority('admin')")
    Invoice updateStandardInvoice(@PathVariable Long idInvoice, @RequestBody Invoice invoice) {
        return invoiceService.updateStandardInvoice(idInvoice, invoice);
    }

    @PutMapping("/update/training/{idInvoice}")
    @PreAuthorize("hasAuthority('admin')")
    Invoice updateTrainingInvoice(@PathVariable Long idInvoice, @RequestBody Invoice invoice) {
        return invoiceService.updateTrainingInvoice(idInvoice, invoice);
    }

    @DeleteMapping("/delete/{idInvoice}")
    @PreAuthorize("hasAuthority('admin')")
    void deleteInvoice(@PathVariable Long idInvoice) {
        invoiceService.deleteInvoice(idInvoice);
    }

    @PutMapping("/update/status")
    @PreAuthorize("hasAuthority('admin')")
    Invoice updateStatus(
            @RequestParam("invoiceData") String invoiceData,
            @RequestParam(value = "cheque", required = false) MultipartFile cheque,
            @RequestParam(value = "copyRemise", required = false) MultipartFile copyRemise) {
        return invoiceService.updateStatus(invoiceData, cheque, copyRemise);
    }

    @GetMapping("/nextInvoiceNumber")
    public ResponseEntity<Map<String, String>> getNewInvoiceNumber(@RequestParam int year, @RequestParam int month) {
        String newInvoiceNumber = invoiceService.generateNewInvoiceNumber(year, month);
        // Créez une réponse JSON
        Map<String, String> response = new HashMap<>();
        response.put("invoiceNumber", newInvoiceNumber);

        return ResponseEntity.ok(response);
    }

}
