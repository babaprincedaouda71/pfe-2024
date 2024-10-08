package org.example.trainingservice.service;

import org.example.trainingservice.clients.ClientRest;
import org.example.trainingservice.clients.VendorRest;
import org.example.trainingservice.entity.TrainingGroup;
import org.example.trainingservice.entity.TrainingGroupLifeCycle;
import org.example.trainingservice.entity.TrainingLifeCycle;
import org.example.trainingservice.enums.TrainingGroupStatus;
import org.example.trainingservice.enums.TrainingStatus;
import org.example.trainingservice.exceptions.TrainingGroupNotFoundException;
import org.example.trainingservice.model.Vendor;
import org.example.trainingservice.repo.TrainingGroupRepo;
import org.example.trainingservice.repo.TrainingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class TrainingGroupServiceImpl01 implements TrainingGroupService {
  private final TrainingRepository trainingRepository;
  private final TrainingGroupRepo trainingGroupRepo;
  private final ClientRest clientRest;
  private final VendorRest vendorRest;
  private int staff;

  public TrainingGroupServiceImpl01(
      TrainingRepository trainingRepository,
      TrainingGroupRepo trainingGroupRepo,
      ClientRest clientRest,
      VendorRest vendorRest) {
    this.trainingRepository = trainingRepository;
    this.trainingGroupRepo = trainingGroupRepo;
    this.clientRest = clientRest;
    this.vendorRest = vendorRest;
  }

  @Override
  public List<TrainingGroup> getAllTrainingGroups() {
    List<TrainingGroup> all = trainingGroupRepo.findAll();
    all.forEach(trainingGroup -> {
      Vendor supplier = vendorRest.findVendorById(trainingGroup.getIdVendor());
      trainingGroup.setSupplier(supplier);
    });
    return all;
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
}
