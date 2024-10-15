package org.example.trainingservice.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;import org.example.trainingservice.model.Vendor;

@Getter @Setter @ToString
public class TrainingForGroupDTO {
    private Long idTraining;
    private Long idClient;
    private String corporateName;
    private String theme;
    private byte[] trainingSupport;
    private String pv;
}
