package org.example.trainingservice.model;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Client {
    private Long idClient;
    private String corporateName;
    private String address;
    private String email;
    private String phoneNumber;
    private String nameMainContact;
    private String emailMainContact;
    private String phoneNumberMainContact;
    private String positionMainContact;
    private String color;

//    private String commonCompanyIdentifier;
//    private String taxRegistration;
//    private String commercialRegister;
//    private String professionalTax;
//    private String cnss;
//
//    private byte[] logo;
//    private String field;
//    private String status;
//    private Date deadline;
//    private double limitAmount;
}
