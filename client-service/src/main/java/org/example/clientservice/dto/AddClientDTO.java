package org.example.clientservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddClientDTO {
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

  private byte[] logo;
  private String field;
  private String status;
  private Long deadline;
  private double limitAmount;
  private String color;
}
