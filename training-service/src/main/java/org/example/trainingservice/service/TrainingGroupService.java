package org.example.trainingservice.service;

import org.example.trainingservice.dto.TrainingGroupDTO;
import org.example.trainingservice.entity.TrainingGroup;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface TrainingGroupService {
  List<TrainingGroupDTO> getAllTrainingGroups();

  TrainingGroup updateStatus(Long groupId, TrainingGroup trainingGroup, String status);

  /*Documents de la formation*/
  TrainingGroup addPv(String pv, Long idGroup);

  TrainingGroup removePv(Long idGroup, TrainingGroup trainingGroup);

  TrainingGroup addTrainingSupport(MultipartFile trainingSupport, Long idGroup);

  TrainingGroup removeTrainingSupport(Long idGroup, TrainingGroup trainingGroup);

  TrainingGroup addReferenceCertificate(MultipartFile referenceCertificate, Long idGroup);

  TrainingGroup removeReferenceCertificate(Long idGroup, TrainingGroup trainingGroup);

  TrainingGroup addTrainingNotes(
      MultipartFile presenceList, MultipartFile evaluation, Long idGroup);

  TrainingGroup removeTrainingNotes(Long idGroup, TrainingGroup trainingGroup);

  List<TrainingGroupDTO> getGroupsToBeInvoiced();

    void markGroupAsInvoiced(TrainingGroup group);
}
