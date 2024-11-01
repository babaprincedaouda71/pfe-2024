package org.example.trainingservice.dto;

import org.example.trainingservice.entity.TrainingGroupLifeCycle;
import org.example.trainingservice.enums.TrainingGroupStatus;
import org.example.trainingservice.model.Vendor;

import java.util.List;

public class GroupDTO {
    private Long idGroup;

    private String startDate;

    private String endDate;

    private Long idVendor;

    private List<String> groupDates;

    private int groupStaff;

    private String location;

    private byte[] trainingSupport;

    private byte[] referenceCertificate;

    private String pv;

    private byte[] presenceList;

    private byte[] evaluation;

    private String completionDate;

    private TrainingGroupStatus status;

    private TrainingGroupLifeCycle groupLifeCycle;
}
