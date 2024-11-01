package org.example.invoicingservice.model;

import lombok.*;
import org.example.invoicingservice.enums.TrainingStatus;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Training {
    private Long idTraining;
    private Long idClient;
    private String theme;
    private List<String> trainingDates;
    private List<Group> groups;
    private int days;
    private int staff;
    private Long idVendor;
    private String location;
    private double amount;
    private TrainingStatus status;
    private String completionDate;
}
