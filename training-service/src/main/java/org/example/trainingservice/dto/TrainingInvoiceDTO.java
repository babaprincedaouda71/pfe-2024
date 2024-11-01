package org.example.trainingservice.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.example.trainingservice.entity.TrainingGroup;
import org.example.trainingservice.entity.TrainingLifeCycle;
import org.example.trainingservice.enums.TrainingStatus;
import org.example.trainingservice.model.Client;
import org.example.trainingservice.model.Vendor;

import java.util.List;

@Getter @Setter @ToString
public class TrainingInvoiceDTO {
    private Long idTraining;
    private Long idClient;
    private Client client;
    private String theme;
    private List<String> trainingDates;
    private double amount;
    private double dailyAmount;
    private TrainingStatus status;
    private String completionDate;
    private int staff;
    private List<TrainingGroup> groups;
}
