package org.example.invoicingservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.invoicingservice.enums.InvoiceStatus;
import org.example.invoicingservice.enums.InvoiceType;
import org.example.invoicingservice.model.Client;
import org.example.invoicingservice.model.Group;
import org.example.invoicingservice.model.Product;
import org.example.invoicingservice.model.Training;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Invoice {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long idInvoice;

  private String numberInvoice;

  @Enumerated(EnumType.STRING)
  private InvoiceType invoiceType;

  private String createdAt;

  private Long idClient;

  @Transient private Client client;

  private String editor;

  private InvoiceStatus status;

  private boolean expired;

  private String paymentDate;

  private String paymentMethod;

  private int deadline;

  private double ht;

  private float tva;

  private Double ttc;

  @ElementCollection List<Long> trainingIds;

  @Transient private List<Training> trainings;

  @ElementCollection
  List<Long> groupsIds = new ArrayList<>();

  @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL)
  private List<Product> products;

  @Lob
  @Column(columnDefinition = "LONGBLOB")
  private byte[] cheque;

  private double travelFees;

  @Lob
  @Column(columnDefinition = "LONGBLOB")
  private byte[] copyRemise;
}
