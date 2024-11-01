package org.example.invoicingservice.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.invoicingservice.entity.Invoice;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private int quantity;
    private double unitPrice;
    private double totalPrice;
    @ManyToOne
    @JoinColumn(name = "invoice_id")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Invoice invoice;
}
