package org.example.trainingservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TrainingGroupDTO {
    private Long idGroup;
    private String startDate;
    private String endDate;
    private List<String> dates;
    private int groupStaff;
    private String location;
}
