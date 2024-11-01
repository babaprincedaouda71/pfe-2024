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
public class TrainingDTO {
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
    private double amount;
    private double dailyAmount;
    private Long idBill;
    private TrainingStatus status;
    private TrainingLifeCycle lifeCycle;
    private List<TrainingGroup> groups;
    private byte[] trainingSupport;
    private String pv;
    private byte[] presenceList;
    private byte[] referenceCertificate;
    private byte[] evaluation;
    private String completionDate;
}
