package org.example.clientservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Client {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long idClient;

  private String corporateName;
  private String address;
  private String email;
  private String phoneNumber;
  private String website;

  private String nameMainContact;
  private String emailMainContact;
  private String phoneNumberMainContact;
  private String positionMainContact;

  private String commonCompanyIdentifier;
  private String taxRegistration;
  private String commercialRegister;
  private String professionalTax;
  private String cnss;

  @Lob
  @Column(columnDefinition = "LONGBLOB")
  private byte[] logo;

  private String field;
  private String status;
  private int deadline;
  private double limitAmount;
  private String color;
}
