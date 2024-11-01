package org.example.trainingservice.service;

import org.example.trainingservice.clients.ClientRest;
import org.example.trainingservice.clients.VendorRest;
import org.example.trainingservice.dto.AddTrainingDTO;
import org.example.trainingservice.dto.TrainingDTO;
import org.example.trainingservice.dto.TrainingInvoiceDTO;
import org.example.trainingservice.entity.Training;
import org.example.trainingservice.entity.TrainingGroup;
import org.example.trainingservice.entity.TrainingGroupLifeCycle;
import org.example.trainingservice.entity.TrainingLifeCycle;
import org.example.trainingservice.enums.TrainingGroupStatus;
import org.example.trainingservice.enums.TrainingStatus;
import org.example.trainingservice.exceptions.TrainingNotFoundException;
import org.example.trainingservice.exceptions.TrainingsNotFoundException;
import org.example.trainingservice.mapper.GroupMapper;
import org.example.trainingservice.mapper.TrainingMapper;
import org.example.trainingservice.model.Client;
import org.example.trainingservice.model.Vendor;
import org.example.trainingservice.repo.TrainingGroupRepo;
import org.example.trainingservice.repo.TrainingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@Transactional
@Service
public class TrainingServiceImpl01 implements TrainingService {
  private final TrainingRepository trainingRepository;
  private final TrainingGroupRepo trainingGroupRepo;
  private final TrainingMapper trainingMapper;
  private final ClientRest clientRest;
  private final VendorRest vendorRest;
  private final GroupMapper groupMapper;
  private int staff;
  private final TrainingGroupService trainingGroupService;

  public TrainingServiceImpl01(
      TrainingRepository trainingRepository,
      TrainingGroupRepo trainingGroupRepo,
      TrainingMapper trainingMapper,
      ClientRest clientRest,
      VendorRest vendorRest,
      TrainingGroupService trainingGroupService,
      GroupMapper groupMapper) {
    this.trainingRepository = trainingRepository;
    this.trainingGroupRepo = trainingGroupRepo;
    this.trainingMapper = trainingMapper;
    this.clientRest = clientRest;
    this.vendorRest = vendorRest;
    this.trainingGroupService = trainingGroupService;
    this.staff = 0;
    this.groupMapper = groupMapper;
  }

  @Override
  public AddTrainingDTO addTraining(AddTrainingDTO addTrainingDTO) {
    Set<String> datesSet = new TreeSet<>();
    Training training = trainingMapper.fromAddTrainingDTO(addTrainingDTO);
    List<TrainingGroup> trainingGroups = new ArrayList<>();

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    DateTimeFormatter isoFormatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

    // Boucle pour recuperer les groupDTO des addTrainingDTO
    training
        .getGroups()
        .forEach(
            trainingGroup -> {
              trainingGroup.setTraining(training);
              trainingGroups.add(trainingGroup);
              // Calcul de l'éffectif total
              staff = staff + trainingGroup.getGroupStaff();

              // Ajoute des dates
              if (containsNonEmptyDate(trainingGroup.getGroupDates())) {
                trainingGroup
                    .getGroupDates()
                    .forEach(
                        dateString -> {
                          OffsetDateTime dateTime = OffsetDateTime.parse(dateString, isoFormatter);
                          LocalDate date = dateTime.toLocalDate().plusDays(1);
                          if (date.getDayOfWeek() != DayOfWeek.SUNDAY) {
                            datesSet.add(date.format(formatter));
                          }
                        });
              }
              manageDate(datesSet, formatter, isoFormatter, trainingGroup);
            });

    // Convertir le Set en List
    List<String> datesList = new ArrayList<>(datesSet);

    training.setStaff(staff);
    training.setGroups(trainingGroups);
    training.setAmount(addTrainingDTO.getAmount());
    training.setDailyAmount(addTrainingDTO.getDailyAmount());
    // Réinitialistion de staff
    staff = 0;

    // Set status
    training.setStatus(TrainingStatus.Recherche_formateur);
    training.setLifeCycle(new TrainingLifeCycle());

    // Set status
    training
        .getGroups()
        .forEach(
            trainingGroup -> {
              trainingGroup.setStatus(TrainingGroupStatus.Recherche_formateur);
              trainingGroup.setGroupLifeCycle(new TrainingGroupLifeCycle());
              //              trainingGroup.setInvoiced(false);
              // ******** NEW CODE: Calculate numDays based on group dates ********
              int numDays = calculateNumDays(trainingGroup, formatter, isoFormatter);
              trainingGroup.setNumDays(numDays);
              double amount = numDays * addTrainingDTO.getDailyAmount();
              trainingGroup.setGroupAmount(amount);
              // **************************************************************
            });

    // Set dates
    training.setTrainingDates(datesList);

    // Enregistrement de la formation et des groupes
    Training savedTraining = trainingRepository.save(training);
    List<TrainingGroup> savedGroups = trainingGroupRepo.saveAll(trainingGroups);
    savedGroups.forEach(
        trainingGroup -> {
          if (trainingGroup.getIdVendor() != null) {
            trainingGroup.getGroupLifeCycle().setTrainerSearch(true);
            trainingGroupService.updateStatus(
                trainingGroup.getIdGroup(), trainingGroup, "Validation_Formateur");
          }
        });

    trainingGroupRepo.saveAll(savedGroups);

    return trainingMapper.fromTrainingToAddTrainingDTO(savedTraining);
  }

  // Méthode pour vérifier si le Set contient au moins une date non vide
  private static boolean containsNonEmptyDate(List<String> dates) {
    for (String date : dates) {
      if (!date.isEmpty()) {
        return true;
      }
    }
    return false;
  }

  @Override
  public List<TrainingDTO> getTrainings() {
    List<Training> all = trainingRepository.findAll();
    List<TrainingDTO> trainingDTOS = new ArrayList<>();
    if (all.isEmpty()) {
      throw new TrainingsNotFoundException("Not Training Found In The DataBase");
    }
    all.forEach(
        training -> {
          Client client = clientRest.findClientById(training.getIdClient());
          training.setClient(client);
          Vendor vendor = vendorRest.findVendorById(training.getIdVendor());
          training.setVendor(vendor);
          training
              .getGroups()
              .forEach(
                  trainingGroup -> {
                    Vendor vendor1 = vendorRest.findVendorById(trainingGroup.getIdVendor());
                    trainingGroup.setSupplier(vendor1);
                  });
          trainingDTOS.add(trainingMapper.fromTraining(training));
        });
    return trainingDTOS;
  }

  @Override
  public TrainingDTO getById(Long idTraining) {
    Training training =
        trainingRepository
            .findById(idTraining)
            .orElseThrow(() -> new TrainingNotFoundException("Training Not Found"));
    Client client = clientRest.findClientById(training.getIdClient());
    training
        .getGroups()
        .forEach(
            trainingGroup -> {
              Vendor vendor = vendorRest.findVendorById(trainingGroup.getIdVendor());
              trainingGroup.setSupplier(vendor);
            });
    training.setClient(client);
    return trainingMapper.fromTraining(training);
  }

  @Override
  public AddTrainingDTO updateTraining(AddTrainingDTO addTrainingDTO, Long idTraining) {
    // Handle dates for training
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    DateTimeFormatter isoFormatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

    Set<String> datesSet = new TreeSet<>();

    // Fetch existing training entity
    Training training =
        trainingRepository
            .findById(idTraining)
            .orElseThrow(() -> new TrainingNotFoundException("La formation n'existe pas"));

    // Update training fields
    training.setIdClient(addTrainingDTO.getIdClient());
    training.setTheme(addTrainingDTO.getTheme());
    training.setDays(addTrainingDTO.getDays());
    training.setStaff(addTrainingDTO.getStaff());
    training.setIdVendor(addTrainingDTO.getIdVendor());
    training.setAmount(addTrainingDTO.getAmount());
    training.setDailyAmount(addTrainingDTO.getDailyAmount());

    // Clear existing training dates
    training.getTrainingDates().clear();

    // Process groups from DTO
    addTrainingDTO
        .getGroups()
        .forEach(
            newGroup -> {
              Optional<TrainingGroup> existingGroupOpt =
                  training.getGroups().stream()
                      .filter(
                          group ->
                              group.getIdGroup() != null
                                  && group.getIdGroup().equals(newGroup.getIdGroup()))
                      .findFirst();

              if (existingGroupOpt.isPresent()) {
                // Update existing group
                TrainingGroup existingGroup = existingGroupOpt.get();
                existingGroup.setGroupStaff(newGroup.getGroupStaff());
                existingGroup.setLocation(newGroup.getLocation());
                existingGroup.setIdVendor(newGroup.getIdVendor());
                existingGroup.setGroupDates(newGroup.getGroupDates());
                // ******** NEW CODE: Calculate numDays based on group dates ********
                int numDays = calculateNumDays(newGroup, formatter, isoFormatter);
                existingGroup.setNumDays(numDays);
                double amount = numDays * addTrainingDTO.getDailyAmount();
                existingGroup.setGroupAmount(amount);
                // **************************************************************
                existingGroup.setTraining(training); // Ensure relationship is maintained
              } else {
                // Add new group
                TrainingGroup newTrainingGroup = new TrainingGroup();
                newTrainingGroup.setGroupStaff(newGroup.getGroupStaff());
                newTrainingGroup.setLocation(newGroup.getLocation());
                newTrainingGroup.setIdVendor(newGroup.getIdVendor());
                newTrainingGroup.setGroupDates(newGroup.getGroupDates());
                newTrainingGroup.setGroupLifeCycle(newGroup.getGroupLifeCycle());
                newTrainingGroup.setStatus(TrainingGroupStatus.Recherche_formateur);
                // Set the start and end date
                if (!newGroup.getStartDate().isEmpty()){
                  newTrainingGroup.setStartDate(newGroup.getStartDate());
                  newTrainingGroup.setEndDate(newGroup.getEndDate());
                }
                newTrainingGroup.setTraining(training); // Set reference to training

                // ******** NEW CODE: Calculate numDays based on group dates ********
                int numDays = calculateNumDays(newGroup, formatter, isoFormatter);
                newTrainingGroup.setNumDays(numDays);
                double amount = numDays * addTrainingDTO.getDailyAmount();
                newTrainingGroup.setGroupAmount(amount);
                // ***************************************************************


                // Save new group and handle trainer search status
                TrainingGroup savedGroup = trainingGroupRepo.save(newTrainingGroup);
                if (savedGroup.getIdVendor() != null) {
                  // Vérifier si groupLifeCycle est null et l'initialiser si nécessaire
                  if (savedGroup.getGroupLifeCycle() == null) {
                    savedGroup.setGroupLifeCycle(new TrainingGroupLifeCycle());
                    savedGroup.setStatus(TrainingGroupStatus.Recherche_formateur);
                  }

                  savedGroup.getGroupLifeCycle().setTrainerSearch(true);
                  savedGroup.setStatus(TrainingGroupStatus.Validation_formateur);
                  trainingGroupRepo.save(savedGroup);
                }

                training.getGroups().add(savedGroup); // Add to training entity
              }
            });

    addTrainingDTO
        .getGroups()
        .forEach(
            group -> {
              if (containsNonEmptyDate(group.getGroupDates())) {
                group
                    .getGroupDates()
                    .forEach(
                        dateString -> {
                          LocalDate date;
                          try {
                            date = LocalDate.parse(dateString, formatter);
                          } catch (DateTimeParseException e) {
                            OffsetDateTime dateTime =
                                OffsetDateTime.parse(dateString, isoFormatter);
                            date = dateTime.toLocalDate().plusDays(1);
                          }
                          if (date.getDayOfWeek() != java.time.DayOfWeek.SUNDAY) {
                            datesSet.add(date.format(formatter));
                          }
                        });
              }
              manageDate(datesSet, formatter, isoFormatter, group);
            });

    // Convert Set to List for training dates
    List<String> datesList = new ArrayList<>(datesSet);
    training.setTrainingDates(datesList);

    // Save the training entity with updated groups and dates
    return trainingMapper.fromTrainingToAddTrainingDTO(trainingRepository.save(training));
  }

  // Méthode calculateNumDays mise à jour pour exclure les samedis et dimanches
  private int calculateNumDays(TrainingGroup group, DateTimeFormatter formatter, DateTimeFormatter isoFormatter) {
    int numDays = 0;

    // Calcul des jours consécutifs si startDate et endDate sont fournis
    if (group.getStartDate() != null && group.getEndDate() != null &&
            !group.getStartDate().isEmpty() && !group.getEndDate().isEmpty()) {
      try {
        OffsetDateTime startDateTime = OffsetDateTime.parse(group.getStartDate(), isoFormatter);
        OffsetDateTime endDateTime = OffsetDateTime.parse(group.getEndDate(), isoFormatter);

        LocalDate startDate = startDateTime.toLocalDate().plusDays(1); // Commencer à la date suivante
        LocalDate endDate = endDateTime.toLocalDate().plusDays(1); // Aller jusqu'à la date suivante

        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
          // Exclure les samedis et dimanches
          if (currentDate.getDayOfWeek() != DayOfWeek.SATURDAY &&
                  currentDate.getDayOfWeek() != DayOfWeek.SUNDAY) {
            numDays++;
          }
          currentDate = currentDate.plusDays(1); // Passer au jour suivant
        }
      } catch (DateTimeParseException e) {
        // Gestion d'une erreur de parsing, log et retour d'une valeur par défaut
        System.out.println("Erreur de parsing de la date de début ou de fin : " + e.getMessage());
        return 0; // ou une autre valeur par défaut
      }
    }

    // Calcul des jours non consécutifs à partir de groupDates
    if (containsNonEmptyDate(group.getGroupDates())) {
      Set<String> uniqueDates = new TreeSet<>(group.getGroupDates());
      uniqueDates.removeIf(dateStr -> {
        try {
          OffsetDateTime dateTime = OffsetDateTime.parse(dateStr, isoFormatter);
          LocalDate date = dateTime.toLocalDate().plusDays(1); // Ajustement similaire
          return date.getDayOfWeek() == DayOfWeek.SATURDAY || date.getDayOfWeek() == DayOfWeek.SUNDAY;
        } catch (DateTimeParseException e) {
          System.out.println("Erreur de parsing pour une date non consécutive : " + e.getMessage());
          return true; // Si erreur, on exclut la date
        }
      });
      numDays += uniqueDates.size();
    }

    return numDays;
  }

  //  @Override
  //  public AddTrainingDTO updateTraining(AddTrainingDTO addTrainingDTO, Long idTraining) {
  //    Set<String> datesSet = new TreeSet<>();
  //
  //    Training training =
  //        trainingRepository
  //            .findById(idTraining)
  //            .orElseThrow(() -> new TrainingNotFoundException("La formation n'existe pas"));
  //    training.setIdClient(addTrainingDTO.getIdClient());
  //    training.setTheme(addTrainingDTO.getTheme());
  //    training.setDays(addTrainingDTO.getDays());
  //    training.setStaff(addTrainingDTO.getStaff());
  //    training.setIdVendor(addTrainingDTO.getIdVendor());
  //    training.setAmount(addTrainingDTO.getAmount());
  //
  ////    training.getGroups().clear();
  //
  //    training.getTrainingDates().clear();
  //
  //    addTrainingDTO.getGroups().forEach(newGroup -> {
  //      // Vérifiez si le groupe existe déjà dans training
  //      Optional<TrainingGroup> existingGroupOpt = training.getGroups().stream()
  //              .filter(group -> group.getIdGroup() != null &&
  // group.getIdGroup().equals(newGroup.getIdGroup()))
  //              .findFirst();
  //
  //      if (existingGroupOpt.isPresent()) {
  //        // Mettez à jour les informations du groupe existant
  //        TrainingGroup existingGroup = existingGroupOpt.get();
  //        existingGroup.setGroupStaff(newGroup.getGroupStaff());
  //        existingGroup.setLocation(newGroup.getLocation());
  //        existingGroup.setIdVendor(newGroup.getIdVendor());
  //        existingGroup.setGroupDates(newGroup.getGroupDates());
  //        trainingGroupRepo.save(existingGroup);
  //      } else {
  //        // Si le groupe n'existe pas, créez un nouveau groupe
  //        TrainingGroup newTrainingGroup = new TrainingGroup();
  //        newTrainingGroup.setGroupStaff(newGroup.getGroupStaff());
  //        newTrainingGroup.setLocation(newGroup.getLocation());
  //        newTrainingGroup.setIdVendor(newGroup.getIdVendor());
  //        newTrainingGroup.setGroupDates(newGroup.getGroupDates());
  //        newTrainingGroup.setGroupLifeCycle(newGroup.getGroupLifeCycle());
  //        newTrainingGroup.setStatus(TrainingGroupStatus.Recherche_formateur);
  //        TrainingGroup save = trainingGroupRepo.save(newTrainingGroup);
  //        if (save.getIdVendor() != null) {
  //          save.getGroupLifeCycle().setTrainerSearch(true);
  //          save.setStatus(TrainingGroupStatus.Validation_formateur);
  //          trainingGroupRepo.save(save);
  //        }
  //
  //        // Ajoute le nouveau groupe à l'entité training
  //        training.getGroups().add(newTrainingGroup);
  //      }
  //    });
  //
  //
  //    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
  //    DateTimeFormatter isoFormatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
  //
  //    addTrainingDTO
  //        .getGroups()
  //        .forEach(
  //            group -> {
  ////              group.setTraining(training);
  ////              training.getGroups().add(group);
  //
  //              if (containsNonEmptyDate(group.getGroupDates())) {
  //                group
  //                    .getGroupDates()
  //                    .forEach(
  //                        dateString -> {
  //                          LocalDate date;
  //                          try {
  //                            date = LocalDate.parse(dateString, formatter);
  //                          } catch (DateTimeParseException e) {
  //                            OffsetDateTime dateTime =
  //                                OffsetDateTime.parse(dateString, isoFormatter);
  //                            date = dateTime.toLocalDate().plusDays(1);
  //                          }
  //                          if (date.getDayOfWeek() != java.time.DayOfWeek.SUNDAY) {
  //                            datesSet.add(date.format(formatter));
  //                          }
  //                        });
  //              }
  //              manageDate(datesSet, formatter, isoFormatter, group);
  //            });
  //    // Convertir le Set en List
  //    List<String> datesList = new ArrayList<>(datesSet);
  //    training.setTrainingDates(datesList);
  //    return trainingMapper.fromTrainingToAddTrainingDTO(trainingRepository.save(training));
  //  }

  //  @Override
  //  public AddTrainingDTO updateTraining(AddTrainingDTO addTrainingDTO, Long idTraining) {
  //    Set<String> datesSet = new TreeSet<>();
  //
  //    // Récupération de la formation existante
  //    Training training = trainingRepository
  //            .findById(idTraining)
  //            .orElseThrow(() -> new TrainingNotFoundException("La formation n'existe pas"));
  //
  //    // Mise à jour des informations de la formation
  //    training.setIdClient(addTrainingDTO.getIdClient());
  //    training.setTheme(addTrainingDTO.getTheme());
  //    training.setDays(addTrainingDTO.getDays());
  //    training.setStaff(addTrainingDTO.getStaff());
  //    training.setIdVendor(addTrainingDTO.getIdVendor());
  //    training.setLocation(addTrainingDTO.getLocation());
  //    training.setAmount(addTrainingDTO.getAmount());
  //
  //    // Créer une liste temporaire pour conserver les groupes actuels
  //    List<TrainingGroup> existingGroups = new ArrayList<>(training.getGroups());
  //
  //    // Traitement des nouveaux groupes
  //    List<TrainingGroup> updatedGroups = new ArrayList<>();
  //    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
  //    DateTimeFormatter isoFormatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
  //
  //    addTrainingDTO.getGroups().forEach(group -> {
  //      group.setTraining(training); // Associer le groupe à la formation
  //      updatedGroups.add(group);
  //
  //      // Gestion des dates du groupe
  //      if (containsNonEmptyDate(group.getGroupDates())) {
  //        group.getGroupDates().forEach(dateString -> {
  //          LocalDate date;
  //          try {
  //            date = LocalDate.parse(dateString, formatter);
  //          } catch (DateTimeParseException e) {
  //            OffsetDateTime dateTime = OffsetDateTime.parse(dateString, isoFormatter);
  //            date = dateTime.toLocalDate().plusDays(1);
  //          }
  //          if (date.getDayOfWeek() != DayOfWeek.SUNDAY) {
  //            datesSet.add(date.format(formatter));
  //          }
  //        });
  //      }
  //      manageDate(datesSet, formatter, isoFormatter, group);
  //    });
  //
  //    // Supprimer les groupes qui ne sont plus dans la formation
  //    existingGroups.forEach(existingGroup -> {
  //      if (!updatedGroups.contains(existingGroup)) {
  //        training.removeGroup(existingGroup); // Suppression explicite
  //      }
  //    });
  //
  //    // Ajouter ou mettre à jour les nouveaux groupes
  //    updatedGroups.forEach(newGroup -> {
  //      if (!training.getGroups().contains(newGroup)) {
  //        training.addGroup(newGroup); // Ajout explicite
  //      }
  //    });
  //
  //    // Mise à jour des groupes dans la formation
  //    training.setGroups(updatedGroups);
  //
  //    // Mise à jour des dates dans la formation
  //    List<String> datesList = new ArrayList<>(datesSet);
  //    training.setTrainingDates(datesList);
  //
  //    // Enregistrer les changements
  //    Training updatedTraining = trainingRepository.save(training);
  //    trainingGroupRepo.saveAll(updatedGroups);
  //
  //    // Retourner le DTO mis à jour
  //    return trainingMapper.fromTrainingToAddTrainingDTO(updatedTraining);
  //  }

  @Override
  public TrainingDTO updateStatus(Long idTraining, TrainingDTO trainingDTO, String status) {
    Training training =
        trainingRepository
            .findById(idTraining)
            .orElseThrow(() -> new TrainingNotFoundException("Training Not Found"));

    TrainingLifeCycle lifeCycle = trainingDTO.getLifeCycle();

    if (lifeCycle == null) {
      lifeCycle = training.getLifeCycle();
      if (status.equals("Facturation")) {
        lifeCycle.setInvoicing(true);
        training.setStatus(determineStatusFromLifeCycle(lifeCycle));
        training.setLifeCycle(lifeCycle);
      }
      if (status.equals("Reglement")) {
        lifeCycle.setPayment(true);
        training.setStatus(determineStatusFromLifeCycle(lifeCycle));
        training.setLifeCycle(lifeCycle);
        System.out.println(
            "After : " + "Facturation : " + lifeCycle.isPayment() + " " + training.getStatus());
      }
    } else {
      if (lifeCycle.isCompletion()) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String formattedDate = formatter.format(new Date());

        training.setCompletionDate(formattedDate);
      }
      training.setLifeCycle(lifeCycle);
      TrainingStatus newStatus = determineStatusFromLifeCycle(lifeCycle);
      training.setStatus(newStatus);
      System.out.println("After : " + lifeCycle.isInvoicing() + " " + training.getStatus());
    }

    return trainingMapper.fromTraining(trainingRepository.save(training));
  }

  private TrainingStatus determineStatusFromLifeCycle(TrainingLifeCycle lifeCycle) {
    if (lifeCycle.isReference()) {
      return TrainingStatus.Realisée;
    } else if (lifeCycle.isPayment()) {
      return TrainingStatus.Attestation_de_référence;
    } else if (lifeCycle.isInvoicing()) {
      return TrainingStatus.Reglement;
    } else if (lifeCycle.isCertif()) {
      return TrainingStatus.Facturation;
    } else if (lifeCycle.isCompletion()) {
      return TrainingStatus.Attestation;
    } else if (lifeCycle.isImpression()) {
      return TrainingStatus.Realisation;
    } else if (lifeCycle.isTrainingSupport()) {
      return TrainingStatus.Impression;
    } else if (lifeCycle.isKickOfMeeting()) {
      return TrainingStatus.Support_de_formation;
    } else if (lifeCycle.isTrainerValidation()) {
      return TrainingStatus.Reunion_de_cadrage;
    } else if (lifeCycle.isTrainerSearch()) {
      return TrainingStatus.Validation_formateur;
    } else {
      return TrainingStatus.Recherche_formateur;
    }
  }

  /*****************************************************************************************************/

  @Override
  public AddTrainingDTO addPv(String pv, Long idTraining) {
    Training training =
        trainingRepository
            .findById(idTraining)
            .orElseThrow(
                () ->
                    new TrainingNotFoundException(
                        "La Formation avec id " + idTraining + " n'existe pas"));
    training.setPv(pv);
    Training save = trainingRepository.save(training);
    return trainingMapper.fromTrainingToAddTrainingDTO(save);
  }

  @Override
  public TrainingDTO removePv(Long idTraining, TrainingDTO trainingDTO) {
    Training training =
        trainingRepository
            .findById(idTraining)
            .orElseThrow(
                () ->
                    new TrainingNotFoundException(
                        "La Formation avec id " + idTraining + " n'existe pas"));
    training.setPv(null);
    Training save = trainingRepository.save(training);
    return trainingMapper.fromTraining(save);
  }

  @Override
  public AddTrainingDTO addTrainingSupport(MultipartFile trainingSupport, Long idTraining) {
    Training training =
        trainingRepository
            .findById(idTraining)
            .orElseThrow(
                () ->
                    new TrainingNotFoundException(
                        "La Formation avec id " + idTraining + " n'existe pas"));
    try {
      training.setTrainingSupport(trainingSupport.getBytes());
      trainingRepository.save(training);
      return trainingMapper.fromTrainingToAddTrainingDTO(training);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  public TrainingDTO removeTrainingSupport(Long idTraining, TrainingDTO trainingDTO) {
    Training training =
        trainingRepository
            .findById(idTraining)
            .orElseThrow(
                () ->
                    new TrainingNotFoundException(
                        "La Formation avec id " + idTraining + " n'existe pas"));
    training.setTrainingSupport(null);
    Training save = trainingRepository.save(training);
    return trainingMapper.fromTraining(save);
  }

  @Override
  public AddTrainingDTO addReferenceCertificate(
      MultipartFile referenceCertificate, Long idTraining) {
    Training training =
        trainingRepository
            .findById(idTraining)
            .orElseThrow(
                () ->
                    new TrainingNotFoundException(
                        "La Formation avec id " + idTraining + " n'existe pas"));
    try {
      training.setReferenceCertificate(referenceCertificate.getBytes());
      trainingRepository.save(training);
      return trainingMapper.fromTrainingToAddTrainingDTO(training);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  public TrainingDTO removeReferenceCertificate(Long idTraining, TrainingDTO trainingDTO) {
    Training training =
        trainingRepository
            .findById(idTraining)
            .orElseThrow(
                () ->
                    new TrainingNotFoundException(
                        "La Formation avec id " + idTraining + " n'existe pas"));
    training.setReferenceCertificate(null);
    Training save = trainingRepository.save(training);
    return trainingMapper.fromTraining(save);
  }

  @Override
  public AddTrainingDTO addTrainingNotes(
      MultipartFile presenceList, MultipartFile evaluation, Long idTraining) {
    Training training =
        trainingRepository
            .findById(idTraining)
            .orElseThrow(
                () ->
                    new TrainingNotFoundException(
                        "La Formation avec id " + idTraining + " n'existe pas"));
    try {
      training.setPresenceList(presenceList.getBytes());
      training.setEvaluation(evaluation.getBytes());
      trainingRepository.save(training);
      return trainingMapper.fromTrainingToAddTrainingDTO(training);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  public TrainingDTO removeTrainingNotes(Long idTraining, TrainingDTO trainingDTO) {
    Training training =
        trainingRepository
            .findById(idTraining)
            .orElseThrow(
                () ->
                    new TrainingNotFoundException(
                        "La Formation avec id " + idTraining + " n'existe pas"));
    training.setPresenceList(null);
    training.setEvaluation(null);
    Training save = trainingRepository.save(training);
    return trainingMapper.fromTraining(save);
  }

  @Override
  public TrainingDTO deleteTraining(Long idTraining) {
    Training training =
        trainingRepository
            .findById(idTraining)
            .orElseThrow(() -> new TrainingNotFoundException("Training Not Found"));
    trainingGroupRepo.deleteTrainingGroups(training);
    trainingRepository.delete(training);
    return trainingMapper.fromTraining(training);
  }

  @Override
  public List<TrainingDTO> getTrainingsOfWeek() {
    // Initialisation de trainingDto
    List<TrainingDTO> trainingOfWeekDTOS = new ArrayList<>();

    // Date actuelle
    LocalDate currentDate = LocalDate.now();

    // Obtenez la date de début de la semaine en cours (lundi)
    LocalDate startOfWeek = currentDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));

    // Obtenez la date de fin de la semaine en cours (dimanche)
    LocalDate endOfWeek = currentDate.with(TemporalAdjusters.nextOrSame(DayOfWeek.FRIDAY));

    // Recupération des trainings de la semaine
    List<Training> trainings = trainingRepository.findAll();

    // Gestion des exceptions
    if (trainings.isEmpty()) {
      throw new TrainingsNotFoundException("Not Training Found In The DataBase");
    }

    // Filtrage des trainings
    List<Training> tow =
        trainings.stream()
            .filter(
                training ->
                    isFirstDateInCurrentWeek(training.getTrainingDates(), startOfWeek, endOfWeek))
            .toList();

    // Mapping des trainings en trainingDTOs
    tow.forEach(
        training -> {
          trainingOfWeekDTOS.add(trainingMapper.fromTraining(training));
        });

    // Retour de la liste de training
    return trainingOfWeekDTOS;
  }

  private boolean isFirstDateInCurrentWeek(
      List<String> trainingDates, LocalDate startDate, LocalDate endDate) {
    if (trainingDates != null && !trainingDates.isEmpty()) {
      LocalDate firstDate = LocalDate.parse(trainingDates.getFirst());
      return (firstDate.isEqual(startDate) || firstDate.isAfter(startDate))
          && (firstDate.isEqual(endDate) || firstDate.isBefore(endDate));
    }
    return false;
  }

  @Override
  public List<TrainingInvoiceDTO> getTrainingsClient() {
    List<Training> trainings = trainingRepository.findByStatus(TrainingStatus.Facturation);
    return getTrainingInvoiceDTOS(trainings);
  }

  @Override
  public List<TrainingInvoiceDTO> getTrainingsByClient(Long idClient) {
    List<Training> trainings = trainingRepository.findByIdClient(idClient);
    //    List<Training> trainings =
    //        trainingRepository.findByStatusInAndIdClient(
    //            List.of(TrainingStatus.Facturation, TrainingStatus.Reglement), idClient);
    return getTrainingInvoiceDTOS(trainings);
  }

  private List<TrainingInvoiceDTO> getTrainingInvoiceDTOS(List<Training> trainings) {
    trainings.forEach(
        training -> {
          Client client = clientRest.findClientById(training.getIdClient());
          training.setClient(client);
        });
    List<Training> sortedTrainings =
        trainings.stream()
            .filter(
                training ->
                    training.getClient() != null) // Filtrer les trainings avec un client non null
            .sorted(
                Comparator.comparing(
                    training -> training.getClient().getCorporateName())) // Trier par corporateName
            .toList(); // Collecter le résultat dans une liste

    List<TrainingInvoiceDTO> trainingInvoiceDTOS = new ArrayList<>();
    for (Training training : sortedTrainings) {
      trainingInvoiceDTOS.add(trainingMapper.toTrainingInvoiceDTO(training));
    }
    return trainingInvoiceDTOS;
  }

  private void manageDate(
      Set<String> datesSet,
      DateTimeFormatter formatter,
      DateTimeFormatter isoFormatter,
      TrainingGroup trainingGroup) {
    if (!trainingGroup.getStartDate().isEmpty() && !trainingGroup.getEndDate().isEmpty()) {
      OffsetDateTime startDateTime =
          OffsetDateTime.parse(trainingGroup.getStartDate(), isoFormatter);
      OffsetDateTime endDateTime = OffsetDateTime.parse(trainingGroup.getEndDate(), isoFormatter);

      LocalDate startDate =
          startDateTime.toLocalDate().plusDays(1); // commencer à la date suivante de startDate
      LocalDate endDate =
          endDateTime.toLocalDate().plusDays(1); // aller jusqu'à la date suivante de endDate

      LocalDate currentDate = startDate;
      while (!currentDate.isAfter(endDate)) {
        if (currentDate.getDayOfWeek() != DayOfWeek.SUNDAY) { // exclure les dimanches
          datesSet.add(currentDate.format(formatter));
        }
        currentDate = currentDate.plusDays(1);
      }
    }
  }

  /*********************** Gestion des groupes *****************/
  @Override
  public TrainingDTO getGroupsByTraining(Long idTraining) {
    Training training =
        trainingRepository
            .findById(idTraining)
            .orElseThrow(() -> new TrainingNotFoundException("Training Not Found"));
    Client client = clientRest.findClientById(training.getIdClient());
    training.setClient(client);
    return trainingMapper.fromTraining(training);
  }

  @Override
  public boolean checkIfPvExists(Long idTraining) {
    return trainingRepository
        .findById(idTraining)
        .map(training -> training.getPv() != null && !training.getPv().isEmpty())
        .orElse(false);
  }

  @Override
  public boolean checkIfTrainingSupportExists(Long idTraining) {
    return trainingRepository
        .findById(idTraining)
        .map(
            training ->
                training.getTrainingSupport() != null && training.getTrainingSupport().length > 0)
        .orElse(false);
  }
}
