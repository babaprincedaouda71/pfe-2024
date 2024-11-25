package org.example.trainingservice.dto;

import java.util.List;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.example.trainingservice.entity.TrainingGroup;
import org.example.trainingservice.entity.TrainingLifeCycle;
import org.example.trainingservice.enums.TrainingStatus;
import org.example.trainingservice.model.Client;
import org.example.trainingservice.model.Vendor;

@Getter @Setter @ToString
public class GetTrainingsDTO {
    private Long idTraining;
    private Long idClient;
    private Client client;
    private String theme;
    private int days;
    private int staff;
    private Long idVendor;
    private Vendor vendor;
    private List<String> trainingDates;
    private String location;
    private TrainingStatus status;
    private TrainingLifeCycle lifeCycle;
    private List<TrainingGroup> groups;
}
