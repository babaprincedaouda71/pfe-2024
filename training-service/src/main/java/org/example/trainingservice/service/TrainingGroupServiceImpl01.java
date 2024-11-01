package org.example.trainingservice.service;

import org.example.trainingservice.clients.ClientRest;
import org.example.trainingservice.clients.VendorRest;
import org.example.trainingservice.dto.TrainingDTO;
import org.example.trainingservice.dto.TrainingForGroupDTO;
import org.example.trainingservice.dto.TrainingGroupDTO;
import org.example.trainingservice.entity.Training;
import org.example.trainingservice.entity.TrainingGroup;
import org.example.trainingservice.entity.TrainingGroupLifeCycle;
import org.example.trainingservice.enums.TrainingGroupStatus;
import org.example.trainingservice.exceptions.TrainingGroupNotFoundException;
import org.example.trainingservice.mapper.GroupMapper;
import org.example.trainingservice.model.Client;
import org.example.trainingservice.repo.TrainingGroupRepo;
import org.example.trainingservice.repo.TrainingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class TrainingGroupServiceImpl01 implements TrainingGroupService {
  private final TrainingRepository trainingRepository;
  private final TrainingGroupRepo trainingGroupRepo;
  private final ClientRest clientRest;
  private final VendorRest vendorRest;
  private final GroupMapper groupMapper;
  private int staff;

  public TrainingGroupServiceImpl01(
          TrainingRepository trainingRepository,
          TrainingGroupRepo trainingGroupRepo,
          ClientRest clientRest,
          VendorRest vendorRest, GroupMapper groupMapper) {
    this.trainingRepository = trainingRepository;
    this.trainingGroupRepo = trainingGroupRepo;
    this.clientRest = clientRest;
    this.vendorRest = vendorRest;
      this.groupMapper = groupMapper;
  }

  @Override
  public List<TrainingGroupDTO> getAllTrainingGroups() {
    List<TrainingGroup> all = trainingGroupRepo.findAll();
    List<TrainingGroupDTO> groupDTOS = new ArrayList<>();
    all.forEach(
        trainingGroup -> {
          TrainingGroupDTO groupDTO = groupMapper.fromTrainingGroupToDTO(trainingGroup);
          // Mapper le training vers le DTO
          TrainingForGroupDTO trainingDTO = new TrainingForGroupDTO();
          Training training = trainingGroup.getTraining();
          if (training != null) {
            trainingDTO.setIdTraining(training.getIdTraining());
            trainingDTO.setTheme(training.getTheme());
            trainingDTO.setIdClient(training.getIdClient());
          }
          groupDTO.setTraining(trainingDTO);
          groupDTOS.add(groupDTO);
        });
    return groupDTOS;
  }

  @Override
  public TrainingGroup updateStatus(Long groupId, TrainingGroup trainingGroup, String status) {
    // Récupération du groupe de formation à partir de l'ID
    TrainingGroup group =
        trainingGroupRepo
            .findById(groupId)
            .orElseThrow(() -> new TrainingGroupNotFoundException("Training Group not found"));

    // Récupération du cycle de vie actuel du groupe
    TrainingGroupLifeCycle groupLifeCycle = trainingGroup.getGroupLifeCycle();

    // Si le cycle de vie fourni est null, on récupère celui existant
    if (groupLifeCycle == null) {
      groupLifeCycle = group.getGroupLifeCycle();
    }

    // Mise à jour du cycle de vie et du statut selon le nouveau statut
    switch (status) {
      case "Facturation":
        groupLifeCycle.setInvoicing(true);
        break;
      case "Reglement":
        groupLifeCycle.setPayment(true);
        break;
      default:
        // Si le groupe est complété, on fixe la date d'achèvement
        if (groupLifeCycle.isCompletion()) {
          group.setCompletionDate(formatCurrentDate());
        }
        break;
    }

    // Mise à jour du cycle de vie et du statut du groupe
    group.setGroupLifeCycle(groupLifeCycle);
    group.setStatus(determineStatusFromLifeCycle(groupLifeCycle));

    // Sauvegarde du groupe mis à jour dans la base de données
    trainingGroupRepo.save(group);

    return group; // Retourne le groupe mis à jour
  }

  /**
   * Détermine le statut d'un groupe de formation en fonction de son cycle de vie.
   *
   * @param groupLifeCycle Le cycle de vie du groupe
   * @return Le nouveau statut du groupe de formation
   */
  private TrainingGroupStatus determineStatusFromLifeCycle(TrainingGroupLifeCycle groupLifeCycle) {
    // Détermination du statut en fonction de chaque étape du cycle de vie
    if (groupLifeCycle.isReference()) {
      return TrainingGroupStatus.Realisée;
    } else if (groupLifeCycle.isPayment()) {
      return TrainingGroupStatus.Attestation_de_référence;
    } else if (groupLifeCycle.isInvoicing()) {
      return TrainingGroupStatus.Reglement;
    } else if (groupLifeCycle.isCertif()) {
      return TrainingGroupStatus.Facturation;
    } else if (groupLifeCycle.isCompletion()) {
      return TrainingGroupStatus.Attestation;
    } else if (groupLifeCycle.isImpression()) {
      return TrainingGroupStatus.Realisation;
    } else if (groupLifeCycle.isTrainingSupport()) {
      return TrainingGroupStatus.Impression;
    } else if (groupLifeCycle.isKickOfMeeting()) {
      return TrainingGroupStatus.Support_de_formation;
    } else if (groupLifeCycle.isTrainerValidation()) {
      return TrainingGroupStatus.Reunion_de_cadrage;
    } else if (groupLifeCycle.isTrainerSearch()) {
      return TrainingGroupStatus.Validation_formateur;
    } else {
      return TrainingGroupStatus.Recherche_formateur;
    }
  }

  /**
   * Formate la date actuelle au format "yyy4y-MM-dd".
   *
   * @return La date formatée sous forme de chaîne de caractères
   */
  private String formatCurrentDate() {
    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
    return formatter.format(new Date());
  }

  /*Documents de la formation*/
  @Override
  public TrainingGroup addPv(String pv, Long idGroup) {

    TrainingGroup group =
        trainingGroupRepo
            .findById(idGroup)
            .orElseThrow(
                () ->
                    new TrainingGroupNotFoundException(
                        "Le groupe avec id " + idGroup + " n'existe pas"));
    group.getTraining().setPv(pv);
    return trainingGroupRepo.save(group);
  }

  @Override
  public TrainingGroup removePv(Long idGroup, TrainingGroup trainingGroup) {
    TrainingGroup group =
        trainingGroupRepo
            .findById(idGroup)
            .orElseThrow(
                () ->
                    new TrainingGroupNotFoundException(
                        "Le groupe avec id " + idGroup + " n'existe pas"));
    group.setPv(null);
    return trainingGroupRepo.save(group);
  }

  @Override
  public TrainingGroup addTrainingSupport(MultipartFile trainingSupport, Long idGroup) {
    TrainingGroup group =
        trainingGroupRepo
            .findById(idGroup)
            .orElseThrow(
                () ->
                    new TrainingGroupNotFoundException(
                        "Le Groupe avec id " + idGroup + " n'existe pas"));
    try {
      group.getTraining().setTrainingSupport(trainingSupport.getBytes());
      return trainingGroupRepo.save(group);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  public TrainingGroup removeTrainingSupport(Long idGroup, TrainingGroup trainingGroup) {
    TrainingGroup group =
        trainingGroupRepo
            .findById(idGroup)
            .orElseThrow(
                () ->
                    new TrainingGroupNotFoundException(
                        "Le Groupe avec id " + idGroup + " n'existe pas"));
    group.setTrainingSupport(null);
    return trainingGroupRepo.save(group);
  }

  @Override
  public TrainingGroup addReferenceCertificate(MultipartFile referenceCertificate, Long idGroup) {
    TrainingGroup group =
        trainingGroupRepo
            .findById(idGroup)
            .orElseThrow(
                () ->
                    new TrainingGroupNotFoundException(
                        "Le Groupe avec id " + idGroup + " n'existe pas"));
    try {
      group.setReferenceCertificate(referenceCertificate.getBytes());
      return trainingGroupRepo.save(group);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  public TrainingGroup removeReferenceCertificate(Long idGroup, TrainingGroup trainingGroup) {
    TrainingGroup group =
        trainingGroupRepo
            .findById(idGroup)
            .orElseThrow(
                () ->
                    new TrainingGroupNotFoundException(
                        "Le Groupe avec id " + idGroup + " n'existe pas"));
    group.setReferenceCertificate(null);
    return trainingGroupRepo.save(group);
  }

  @Override
  public TrainingGroup addTrainingNotes(
      MultipartFile presenceList, MultipartFile evaluation, Long idGroup) {
    TrainingGroup group =
        trainingGroupRepo
            .findById(idGroup)
            .orElseThrow(
                () ->
                    new TrainingGroupNotFoundException(
                        "Le Groupe avec id " + idGroup + " n'existe pas"));
    try {
      group.setPresenceList(presenceList.getBytes());
      group.setEvaluation(evaluation.getBytes());
      return trainingGroupRepo.save(group);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  public TrainingGroup removeTrainingNotes(Long idGroup, TrainingGroup trainingGroup) {
    TrainingGroup group =
        trainingGroupRepo
            .findById(idGroup)
            .orElseThrow(
                () ->
                    new TrainingGroupNotFoundException(
                        "Le Groupe avec id " + idGroup + " n'existe pas"));
    group.setPresenceList(null);
    group.setEvaluation(null);
    return trainingGroupRepo.save(group);
  }

  @Override
  public List<TrainingGroupDTO> getGroupsToBeInvoiced() {
    List<TrainingGroup> groupsByStatus = trainingGroupRepo.findTrainingGroupsByStatus(TrainingGroupStatus.Facturation);
    List<TrainingGroupDTO> dtos = new ArrayList<>();
    groupsByStatus.forEach(trainingGroup -> {
      Client clientById = clientRest.findClientById(trainingGroup.getTraining().getIdClient());
      TrainingGroupDTO trainingGroupDTO = groupMapper.fromTrainingGroupToDTO(trainingGroup);
      trainingGroupDTO.getTraining().setCorporateName(clientById.getCorporateName());
      dtos.add(trainingGroupDTO);
    });
    return dtos;
  }

  @Override
  public void markGroupAsInvoiced(TrainingGroup group) {
    trainingGroupRepo.save(group);
  }
}
