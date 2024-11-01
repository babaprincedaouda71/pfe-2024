package org.example.trainingservice;

import org.example.trainingservice.clients.ClientRest;
import org.example.trainingservice.entity.Training;
import org.example.trainingservice.entity.TrainingGroup;
import org.example.trainingservice.entity.TrainingGroupLifeCycle;
import org.example.trainingservice.entity.TrainingLifeCycle;
import org.example.trainingservice.enums.*;
import org.example.trainingservice.repo.TrainingGroupRepo;
import org.example.trainingservice.repo.TrainingLifeCycleRepo;
import org.example.trainingservice.repo.TrainingRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@SpringBootApplication
@EnableFeignClients
public class TrainingServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(TrainingServiceApplication.class, args);
    }

//    @Bean
//    CommandLineRunner start(TrainingRepository trainingRepository,
//                            TrainingGroupRepo trainingGroupRepo,
//                            TrainingLifeCycleRepo trainingLifeCycleRepo,
//                            ClientRest clientRest) {
//        return args -> {
//            // Life Cycle
//            TrainingLifeCycle lifeCycle1 = TrainingLifeCycle.builder()
//                    .trainerSearch(true)
//                    .trainerValidation(true)
//                    .kickOfMeeting(true)
//                    .trainingSupport(true)
//                    .impression(true)
//                    .completion(true)
//                    .certif(true)
//                    .invoicing(false)
//                    .payment(false)
//                    .build();
//
//            TrainingLifeCycle lifeCycle2 = TrainingLifeCycle.builder()
//                    .trainerSearch(true)
//                    .trainerValidation(true)
//                    .kickOfMeeting(true)
//                    .trainingSupport(true)
//                    .impression(true)
//                    .completion(true)
//                    .certif(true)
//                    .invoicing(false)
//                    .payment(false)
//                    .build();
//
//            TrainingGroupLifeCycle groupLifeCycle1 = TrainingGroupLifeCycle.builder()
//                    .trainerSearch(false)
//                    .trainerValidation(false)
//                    .kickOfMeeting(false)
//                    .trainingSupport(false)
//                    .impression(false)
//                    .completion(false)
//                    .certif(false)
//                    .invoicing(false)
//                    .payment(false)
//                    .build();
//
//            TrainingGroupLifeCycle groupLifeCycle2 = TrainingGroupLifeCycle.builder()
//                    .trainerSearch(false)
//                    .trainerValidation(false)
//                    .kickOfMeeting(false)
//                    .trainingSupport(false)
//                    .impression(false)
//                    .completion(false)
//                    .certif(false)
//                    .invoicing(false)
//                    .payment(false)
//                    .build();
//
////            TrainingLifeCycle lifeCycle1 = TrainingLifeCycle.builder()
////                    .state(LifeCycleState.TRAINER_SEARCH)
////                    .build();
////
////            TrainingLifeCycle lifeCycle2 = TrainingLifeCycle.builder()
////                    .state(LifeCycleState.TRAINER_SEARCH)
////                    .build();
//
//            // Liste de formations
//            List<Training> trainings = new ArrayList<>();
//
//            Training training1 = Training.builder()
//                    .idClient(1L)
//                    .client(clientRest.findClientById(1L))
//                    .theme("Approche processus")
//                    .days(3)
//                    .staff(10)
//                    .idVendor(1L)
//                    .location("Mohammedia")
//                    .amount(1500)
//                    .trainingDates(Arrays.asList("2024-05-15", "2024-05-17", "2024-06-03"))
////                    .confirmed(Choices.NON)
////                    .done(Choices.NON)
////                    .state("EN_COURS")
//                    .status(TrainingStatus.Facturation)
//                    .lifeCycle(lifeCycle1)
//                    .completionDate("2024-06-03")
//                    .build();
//            trainings.add(training1);
//
//            Training training2 = Training.builder()
//                    .idClient(2L)
//                    .client(clientRest.findClientById(2L))
//                    .theme("Sécourisme")
//                    .days(2)
//                    .staff(15)
//                    .idVendor(1L)
//                    .location("Casablanca")
//                    .amount(2500)
//                    .trainingDates(Arrays.asList("2024-05-13", "2024-05-17", "2024-06-03"))
////                    .confirmed(Choices.NON)
////                    .done(Choices.NON)
////                    .state("CLOTUREE")
//                    .status(TrainingStatus.Facturation)
//                    .lifeCycle(lifeCycle2)
//                    .completionDate("2024-06-03")
//                    .build();
//            trainings.add(training2);
//
//
//            //Liste de groupes
//            List<TrainingGroup> trainingGroups = Arrays.asList(
//                    TrainingGroup.builder()
//                            .groupStaff(2)
//                            .groupDates(Arrays.asList("2024-05-15", "2024-05-17", "2024-05-20"))
//                            .training(training1)
//                            .location(training1.getLocation())
//                            .status(TrainingGroupStatus.Recherche_formateur)
//                            .groupLifeCycle(groupLifeCycle1)
//                            .idVendor(1L)
//                            .build(),
//                    TrainingGroup.builder()
//                            .groupStaff(3)
//                            .groupDates(Arrays.asList("2024-05-13", "2024-05-17", "2024-05-21"))
//                            .training(training2)
//                            .status(TrainingGroupStatus.Recherche_formateur)
//                            .groupLifeCycle(groupLifeCycle2)
//                            .idVendor(3L)
//                            .location(training2.getLocation())
//                            .build()
//            );
//
////            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
//            trainingRepository.saveAll(trainings);
//            trainingGroupRepo.saveAll(trainingGroups);
//            trainingLifeCycleRepo.save(lifeCycle1);
//            trainingLifeCycleRepo.save(lifeCycle2);
//        };
//    }

}
