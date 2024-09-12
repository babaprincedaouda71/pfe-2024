package org.example.instructor.dto;

import lombok.*;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor @ToString
public class InstructorDTO {
    private Long idInstructor;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String ice;
}
