package org.example.trainingservice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder @ToString
public class Mail {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMail;
    private String receiver;
    private String subject;
    private String body;
}
