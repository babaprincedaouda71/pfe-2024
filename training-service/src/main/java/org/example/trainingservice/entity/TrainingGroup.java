package org.example.trainingservice.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class TrainingGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idGroup;

    private String startDate;
    private String endDate;

    @ElementCollection
    @CollectionTable(name = "group_dates", joinColumns = @JoinColumn(name = "groupe_id"))
    @Column(name = "group_date")
    @SuppressWarnings("JpaAttributeTypeInspection")
    private List<String> groupDates;
    private int groupStaff;
    private String location;

    @ManyToOne
    @JoinColumn(name = "training_id")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Training training;

    @Override
    public String toString() {
        return "TrainingGroup{" +
                "idGroup=" + idGroup +
                ", startDate='" + startDate + '\'' +
                ", endDate='" + endDate + '\'' +
                ", groupStaff=" + groupStaff +
                ", location='" + location + '\'' +
                '}';
    }

}
