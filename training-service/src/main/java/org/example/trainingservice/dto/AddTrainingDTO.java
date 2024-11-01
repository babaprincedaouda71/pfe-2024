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
public class AddTrainingDTO {
    private Long idTraining;
    private Long idClient;
    private Client client;
    private String theme;
    private List<String> trainingDates;
    private int days;
    private int staff;
    private Long idVendor;
    private Vendor vendor;
    private String location;
    private double amount;
    private double dailyAmount;
    private TrainingStatus status;
    private TrainingLifeCycle lifeCycle;
    private List<TrainingGroup> groups;
    private String completionDate;
}
