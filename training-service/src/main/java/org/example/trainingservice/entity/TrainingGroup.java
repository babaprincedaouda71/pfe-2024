package org.example.trainingservice.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.example.trainingservice.enums.TrainingGroupStatus;
import org.example.trainingservice.model.Vendor;

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

  private String label;

  private String startDate;
  private String endDate;

  private Long idVendor;

  @Transient private Vendor supplier;

  @ElementCollection
  @CollectionTable(name = "group_dates", joinColumns = @JoinColumn(name = "groupe_id"))
  @Column(name = "group_date")
  @SuppressWarnings("JpaAttributeTypeInspection")
  private List<String> groupDates;

  private int groupStaff;
  private String location;

  private int numDays;

  private double groupAmount;


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

  @Enumerated(EnumType.STRING)
  private TrainingGroupStatus status;

  @ManyToOne
  @JoinColumn(name = "training_id")
  @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
  private Training training;

//  private boolean invoiced;

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "lifecycle_id", referencedColumnName = "idLifeCycle")
  private TrainingGroupLifeCycle groupLifeCycle;

  @Override
  public String toString() {
    return "TrainingGroup{"
        + "idGroup="
        + idGroup
        + ", startDate='"
        + startDate
        + '\''
        + ", endDate='"
        + endDate
        + '\''
        + ", groupStaff="
        + groupStaff
        + ", location='"
        + location
        + '\''
        + '}';
  }
}
