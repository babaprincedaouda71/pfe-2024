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
//@DiscriminatorValue("natural_person")
public class NaturalPerson{
    private String nic;
    private String cv;
}
