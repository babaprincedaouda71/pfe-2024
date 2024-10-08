package org.example.trainingservice.web;

import java.util.List;
import lombok.AllArgsConstructor;
import org.example.trainingservice.dto.AddTrainingDTO;
import org.example.trainingservice.dto.TrainingDTO;
import org.example.trainingservice.dto.TrainingInvoiceDTO;
import org.example.trainingservice.entity.TrainingGroup;
import org.example.trainingservice.service.TrainingGroupService;
import org.example.trainingservice.service.TrainingService;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@AllArgsConstructor
@RequestMapping("/trainingGroup")
public class TrainingGroupController {
    private TrainingGroupService trainingGroupService;

    @PutMapping("/updateLifeCycle/{idGroup}")
    @PreAuthorize("hasAuthority('admin')")
    public TrainingGroup updateStatus(@PathVariable Long idGroup, @RequestBody TrainingGroup trainingGroup) {
        return trainingGroupService.updateStatus(idGroup, trainingGroup, trainingGroup.getStatus().toString());
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('admin','user')")
    public List<TrainingGroup> getAll() {
        return trainingGroupService.getAllTrainingGroups();
    }
}
