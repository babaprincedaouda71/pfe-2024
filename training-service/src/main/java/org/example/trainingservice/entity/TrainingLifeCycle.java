package org.example.trainingservice.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TrainingLifeCycle {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idLifeCycle;
    private boolean trainerSearch;
    private boolean trainerValidation;
    private boolean kickOfMeeting;
    private boolean trainingSupport;
    private boolean impression;
    private boolean completion;
    private boolean certif;
    private boolean invoicing;
    private boolean payment;
    private boolean reference;

    @OneToOne(mappedBy = "lifeCycle")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Training training;
}
