package org.example.vendorservice.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;

//@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
//@DiscriminatorValue("legal_person")
public class LegalPerson{
    private String ice;
    private String rc;
    private String fi;
}
