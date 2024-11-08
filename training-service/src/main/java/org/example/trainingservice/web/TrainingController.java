package org.example.trainingservice.web;

import lombok.AllArgsConstructor;
import org.example.trainingservice.dto.AddTrainingDTO;
import org.example.trainingservice.dto.TrainingDTO;
import org.example.trainingservice.dto.TrainingInvoiceDTO;
import org.example.trainingservice.entity.Training;
import org.example.trainingservice.service.TrainingService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/training")
public class TrainingController {
  private TrainingService trainingService;

  @PostMapping("/add")
  @PreAuthorize("hasAuthority('admin')")
  public AddTrainingDTO addTraining(@RequestBody AddTrainingDTO addTrainingDTO) {
    return trainingService.addTraining(addTrainingDTO);
  }

  @GetMapping("/all")
  @PreAuthorize("hasAnyAuthority('admin','user')")
  public List<TrainingDTO> getTrainings() {
    return trainingService.getTrainings();
  }

  @PutMapping("/update/{idTraining}")
  @PreAuthorize("hasAuthority('admin')")
  public AddTrainingDTO updateTraining(
      @RequestBody AddTrainingDTO addTrainingDTO, @PathVariable Long idTraining) {
    return trainingService.updateTraining(addTrainingDTO, idTraining);
  }

  @GetMapping("/find/{idTraining}")
  @PreAuthorize("hasAnyAuthority('admin','user')")
  public TrainingDTO getTraining(@PathVariable Long idTraining) {
    return trainingService.getById(idTraining);
  }

  @PutMapping("/updateLifeCycle/{idTraining}")
  @PreAuthorize("hasAuthority('admin')")
  public TrainingDTO updateStatus(
      @PathVariable Long idTraining, @RequestBody TrainingDTO trainingDTO) {
    return trainingService.updateStatus(
        idTraining, trainingDTO, trainingDTO.getStatus().toString());
  }

  @DeleteMapping("/delete/{idTraining}")
  @PreAuthorize("hasAuthority('admin')")
  public TrainingDTO deleteTraining(@PathVariable Long idTraining) {
    return trainingService.deleteTraining(idTraining);
  }

  @GetMapping("/trainingsOfWeek")
  @PreAuthorize("hasAnyAuthority('admin','user')")
  public List<TrainingDTO> getTrainingsOfWeek() {
    return trainingService.getTrainingsOfWeek();
  }

  @PutMapping("/add/pv/{idTraining}")
  @PreAuthorize("hasAuthority('admin')")
  public AddTrainingDTO addPv(@RequestBody String pv, @PathVariable Long idTraining) {
    return trainingService.addPv(pv, idTraining);
  }

  @PutMapping("/remove/pv/{idTraining}")
  @PreAuthorize("hasAuthority('admin')")
  public TrainingDTO removePv(@PathVariable Long idTraining, @RequestBody TrainingDTO trainingDTO) {
    return trainingService.removePv(idTraining, trainingDTO);
  }

  @PutMapping(
      value = {"/add/trainingSupport/{idTraining}"},
      consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
  @PreAuthorize("hasAuthority('admin')")
  public AddTrainingDTO addTrainingSupport(
      @RequestParam(value = "trainingSupport", required = false) MultipartFile trainingSupport,
      @PathVariable Long idTraining) {
    return trainingService.addTrainingSupport(trainingSupport, idTraining);
  }

  @PutMapping("/remove/trainingSupport/{idTraining}")
  @PreAuthorize("hasAuthority('admin')")
  public TrainingDTO removeTrainingSupport(
      @PathVariable Long idTraining, @RequestBody TrainingDTO trainingDTO) {
    return trainingService.removeTrainingSupport(idTraining, trainingDTO);
  }

  @PutMapping(
      value = {"/add/referenceCertificate/{idTraining}"},
      consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
  @PreAuthorize("hasAuthority('admin')")
  public AddTrainingDTO addReferenceCertificate(
      @RequestParam(value = "referenceCertificate", required = false)
          MultipartFile referenceCertificate,
      @PathVariable Long idTraining) {
    return trainingService.addReferenceCertificate(referenceCertificate, idTraining);
  }

  @PutMapping("/remove/referenceCertificate/{idTraining}")
  @PreAuthorize("hasAuthority('admin')")
  public TrainingDTO removeReferenceCertificate(
      @PathVariable Long idTraining, @RequestBody TrainingDTO trainingDTO) {
    return trainingService.removeReferenceCertificate(idTraining, trainingDTO);
  }

  @PutMapping(
      value = {"/add/trainingNotes/{idTraining}"},
      consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
  @PreAuthorize("hasAuthority('admin')")
  public AddTrainingDTO addTrainingNotes(
      @RequestParam(value = "presenceList", required = false) MultipartFile presenceList,
      @RequestParam(value = "evaluation", required = false) MultipartFile evaluation,
      @PathVariable Long idTraining) {
    return trainingService.addTrainingNotes(presenceList, evaluation, idTraining);
  }

  @PutMapping("/remove/trainingNotes/{idTraining}")
  @PreAuthorize("hasAuthority('admin')")
  public TrainingDTO removeTrainingNotes(
      @PathVariable Long idTraining, @RequestBody TrainingDTO trainingDTO) {
    return trainingService.removeTrainingNotes(idTraining, trainingDTO);
  }

  @GetMapping("/find/trainings-client")
  @PreAuthorize("hasAuthority('admin')")
  public List<TrainingInvoiceDTO> getTrainingsClient() {
    return trainingService.getTrainingsClient();
  }

  @GetMapping("/find/trainingsByClient/{idClient}")
  @PreAuthorize("hasAuthority('admin')")
  public List<TrainingInvoiceDTO> getTrainingsByClient(@PathVariable Long idClient) {
    return trainingService.getTrainingsByClient(idClient);
  }

  /************************** Gestion des groupes *****************************/
  @GetMapping("/find/groupsByTraining/{idTraining}")
  @PreAuthorize("hasAnyAuthority('admin','user')")
  public TrainingDTO getGroupsByTraining(@PathVariable Long idTraining) {
    return trainingService.getGroupsByTraining(idTraining);
  }

  @GetMapping("/checkPv/{idTraining}")
  @PreAuthorize("hasAnyAuthority('admin','user')")
  public boolean checkIfPvExists(@PathVariable Long idTraining) {
    return trainingService.checkIfPvExists(idTraining);
  }

  @GetMapping("/checkTrainingSupport/{idTraining}")
  @PreAuthorize("hasAnyAuthority('admin','user')")
  public boolean checkIfTrainingSupportExists(@PathVariable Long idTraining) {
    return trainingService.checkIfTrainingSupportExists(idTraining);
  }

  @PostMapping("/filteredByGroup")
  public ResponseEntity<List<TrainingDTO>> getFilteredTrainings(@RequestBody List<Long> groupIds) {
    List<TrainingDTO> filteredTrainings = trainingService.getTrainingsByGroupIds(groupIds);
    return ResponseEntity.ok(filteredTrainings);
  }
}
