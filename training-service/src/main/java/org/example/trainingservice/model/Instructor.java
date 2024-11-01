package org.example.trainingservice.model;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString
public class Instructor {
    private Long idInstructor;
    private String firstName;
    private String lastName;
    private String email;
}
