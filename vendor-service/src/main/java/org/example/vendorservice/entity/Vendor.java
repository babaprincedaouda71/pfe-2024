package org.example.vendorservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.vendorservice.enums.Services;
import org.example.vendorservice.enums.Status;

import java.time.LocalDate;
import java.util.Date;

@Entity
//@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
//@DiscriminatorColumn(name = "status", discriminatorType = DiscriminatorType.STRING)
@Getter @Setter @ToString @NoArgsConstructor @AllArgsConstructor @Builder
public class Vendor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idVendor;
    private String name;
    @Enumerated(EnumType.STRING)
    private Status status;
    private String phone;
    private String email;
    private String address;
    private String nic;
    private String nameMainContact;
    private String phoneNumberMainContact;
    private String emailMainContact;
    private String positionMainContact;
    private String cnss;
    private String ice;
    private String rc;
    private String fi;
    private String tp;
    private LocalDate createdAt;
    private String bankAccountNumber;
    private Long deadline;
    @Enumerated(EnumType.STRING)
    private Services service;
    @Column(columnDefinition = "LONGBLOB")
    private byte[] rib;
    @Column(columnDefinition = "LONGBLOB")
    private byte[] cv;
    @Column(columnDefinition = "LONGBLOB")
    private byte[] contract;
    @Column(columnDefinition = "LONGBLOB")
    private byte[] convention;
    @Column(columnDefinition = "LONGBLOB")
    private byte[] ctr;
    private String subject;
    private String fee;
}
