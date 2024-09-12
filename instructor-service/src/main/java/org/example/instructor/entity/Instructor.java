package org.example.instructor.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder @ToString
public class Instructor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idInstructor;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String ice;
}
