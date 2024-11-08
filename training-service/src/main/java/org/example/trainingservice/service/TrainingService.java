package org.example.trainingservice.service;

import org.example.trainingservice.dto.AddTrainingDTO;
import org.example.trainingservice.dto.TrainingDTO;
import org.example.trainingservice.dto.TrainingInvoiceDTO;
import org.example.trainingservice.entity.Training;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface TrainingService {
    AddTrainingDTO addTraining(AddTrainingDTO addTrainingDTO);

    List<TrainingDTO> getTrainings();

    TrainingDTO getById(Long idTraining);

    AddTrainingDTO updateTraining(AddTrainingDTO addTrainingDTO, Long idTraining);

    TrainingDTO updateStatus(Long idTraining, TrainingDTO trainingDTO, String status);

    AddTrainingDTO addPv(String pv, Long idTraining);

    TrainingDTO removePv(Long idTraining, TrainingDTO trainingDTO);

    AddTrainingDTO addTrainingSupport(MultipartFile trainingSupport, Long idTraining);

    TrainingDTO removeTrainingSupport(Long idTraining, TrainingDTO trainingDTO);

    AddTrainingDTO addReferenceCertificate(MultipartFile referenceCertificate, Long idTraining);

    TrainingDTO removeReferenceCertificate(Long idTraining, TrainingDTO trainingDTO);

    AddTrainingDTO addTrainingNotes(MultipartFile presenceList, MultipartFile evaluation, Long idTraining);

    TrainingDTO removeTrainingNotes(Long idTraining, TrainingDTO trainingDTO);

    TrainingDTO deleteTraining(Long idTraining);

    List<TrainingDTO> getTrainingsOfWeek();

    List<TrainingInvoiceDTO> getTrainingsClient();

    List<TrainingInvoiceDTO> getTrainingsByClient(Long idClient);

    TrainingDTO getGroupsByTraining(Long idTraining);

    boolean checkIfPvExists(Long idTraining);

    boolean checkIfTrainingSupportExists(Long idTraining);

    List<TrainingDTO> getTrainingsByGroupIds(List<Long> groupIds);
}
