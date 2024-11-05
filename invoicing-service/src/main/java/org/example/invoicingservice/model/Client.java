package org.example.invoicingservice.model;

import lombok.*;

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
    private String commonCompanyIdentifier;
    private String color;
    private int deadline;
}
