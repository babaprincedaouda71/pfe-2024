package org.example.clientservice.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientDTO {
  private Long idClient;
  private String corporateName;
  private String address;
  private String email;
  private String phoneNumber;
  private String website;
  private String nameMainContact;
  private String color;
}
