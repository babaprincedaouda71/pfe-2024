package org.example.trainingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.trainingservice.entity.TrainingGroupLifeCycle;
import org.example.trainingservice.enums.TrainingGroupStatus;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TrainingGroupDTO {
    private Long idGroup;

    private String startDate;

    private String endDate;

    private Long idVendor;

    private List<String> groupDates;

    private int groupStaff;

    private int numDays;

    private double groupAmount;

    private String location;

    private byte[] trainingSupport;

    private byte[] referenceCertificate;

    private String pv;

    private byte[] presenceList;

    private byte[] evaluation;

    private String completionDate;

    private TrainingGroupStatus status;

    private TrainingGroupLifeCycle groupLifeCycle;

    private TrainingForGroupDTO training;

//    private boolean invoiced;

}
