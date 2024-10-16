package org.example.trainingservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.trainingservice.enums.TrainingStatus;
import org.example.trainingservice.model.Client;
import org.example.trainingservice.model.Vendor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Training {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTraining;

    private Long idClient;

    @Transient
    private Client client;

    private String theme;
    private int days;
    private int staff;
    private Long idVendor;

    @Transient
    private Vendor vendor;

    @ElementCollection
    @CollectionTable(name = "training_dates", joinColumns = @JoinColumn(name = "training_id"))
    @Column(name = "training_date")
    private List<String> trainingDates;

    private String location;
    private double amount;

    @Enumerated(EnumType.STRING)
    private TrainingStatus status;

    @OneToMany(mappedBy = "training", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TrainingGroup> groups = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "lifecycle_id", referencedColumnName = "idLifeCycle")
    private TrainingLifeCycle lifeCycle;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] trainingSupport;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] referenceCertificate;

    private String pv;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] presenceList;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] evaluation;

    private String completionDate;


    public void addGroup(TrainingGroup trainingGroup) {
        groups.add(trainingGroup);
        trainingGroup.setTraining(this); // Lier le groupe à cette formation
    }

    public void removeGroup(TrainingGroup trainingGroup) {
        groups.remove(trainingGroup);
        trainingGroup.setTraining(null); // Détacher le groupe de cette formation
    }
}