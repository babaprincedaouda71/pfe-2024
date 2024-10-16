package org.example.invoicingservice.model;

import lombok.*;
import org.example.invoicingservice.enums.GroupStatus;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Group {
    private Long idGroup;
    private Long idVendor;
    private List<String> groupDates;
    private String location;
    private GroupStatus status;
    private int staff;
    private int days;
//    private boolean invoiced;
}
