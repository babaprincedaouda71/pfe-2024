package org.example.trainingservice;

import org.example.trainingservice.clients.ClientRest;
import org.example.trainingservice.entity.Training;
import org.example.trainingservice.entity.TrainingGroup;
import org.example.trainingservice.entity.TrainingLifeCycle;
import org.example.trainingservice.enums.Choices;
import org.example.trainingservice.enums.LifeCycleState;
import org.example.trainingservice.enums.States;
import org.example.trainingservice.enums.TrainingStatus;
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

    @Bean
    CommandLineRunner start(TrainingRepository trainingRepository,
                            TrainingGroupRepo trainingGroupRepo,
                            TrainingLifeCycleRepo trainingLifeCycleRepo,
                            ClientRest clientRest) {
        return args -> {
            // Life Cycle
            TrainingLifeCycle lifeCycle1 = TrainingLifeCycle.builder()
                    .trainerSearch(true)
                    .trainerValidation(true)
                    .kickOfMeeting(true)
                    .trainingSupport(true)
                    .impression(true)
                    .completion(true)
                    .certif(true)
                    .invoicing(false)
                    .payment(false)
                    .build();

            TrainingLifeCycle lifeCycle2 = TrainingLifeCycle.builder()
                    .trainerSearch(true)
                    .trainerValidation(true)
                    .kickOfMeeting(true)
                    .trainingSupport(true)
                    .impression(true)
                    .completion(true)
                    .certif(true)
                    .invoicing(false)
                    .payment(false)
                    .build();

//            TrainingLifeCycle lifeCycle1 = TrainingLifeCycle.builder()
//                    .state(LifeCycleState.TRAINER_SEARCH)
//                    .build();
//
//            TrainingLifeCycle lifeCycle2 = TrainingLifeCycle.builder()
//                    .state(LifeCycleState.TRAINER_SEARCH)
//                    .build();

            // Liste de formations
            List<Training> trainings = new ArrayList<>();

            Training training1 = Training.builder()
                    .idClient(1L)
                    .client(clientRest.findClientById(1L))
                    .theme("Approche processus")
                    .days(3)
                    .staff(10)
                    .idVendor(1L)
                    .location("Mohammedia")
                    .amount(1500)
                    .trainingDates(Arrays.asList("2024-05-15", "2024-05-17", "2024-06-03"))
//                    .confirmed(Choices.NON)
//                    .done(Choices.NON)
//                    .state("EN_COURS")
                    .status(TrainingStatus.Facturation)
                    .lifeCycle(lifeCycle1)
                    .completionDate("2024-06-03")
                    .build();
            trainings.add(training1);

            Training training2 = Training.builder()
                    .idClient(2L)
                    .client(clientRest.findClientById(2L))
                    .theme("Sécourisme")
                    .days(2)
                    .staff(15)
                    .idVendor(1L)
                    .location("Casablanca")
                    .amount(2500)
                    .trainingDates(Arrays.asList("2024-05-13", "2024-05-17", "2024-06-03"))
//                    .confirmed(Choices.NON)
//                    .done(Choices.NON)
//                    .state("CLOTUREE")
                    .status(TrainingStatus.Facturation)
                    .lifeCycle(lifeCycle2)
                    .completionDate("2024-06-03")
                    .build();
            trainings.add(training2);


            //Liste de groupes
            List<TrainingGroup> trainingGroups = Arrays.asList(
                    TrainingGroup.builder()
                            .groupStaff(2)
                            .groupDates(Arrays.asList("2024-05-15", "2024-05-17", "2024-05-20"))
                            .training(training1)
                            .location(training1.getLocation())
                            .build(),
                    TrainingGroup.builder()
                            .groupStaff(3)
                            .groupDates(Arrays.asList("2024-05-13", "2024-05-17", "2024-05-21"))
                            .training(training2)
                            .location(training2.getLocation())
                            .build()
            );

//            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            trainingRepository.saveAll(trainings);
            trainingGroupRepo.saveAll(trainingGroups);
            trainingLifeCycleRepo.save(lifeCycle1);
            trainingLifeCycleRepo.save(lifeCycle2);
//            trainings1.forEach(training -> {
//                List<String> dateS = new ArrayList<>();
//                dateS = training.getTrainingDates();
//                dateS.forEach(s -> {
//                    Dates dates = Dates.builder()
//                            .idTraining(training.getIdTraining())
//                            .date0(LocalDate.parse(s, formatter))
//                            .build();
//                    dateRepo.save(dates);
//                });
//            });

//            List<TrainingFalse> trainingFalses = Arrays.asList(
//                    TrainingFalse.builder().titled("Approche processus").category(TrainingCat.SYSTEME_MANAGEMENT_DE_LA_QUALITE).build(),
//                    TrainingFalse.builder().titled("Principes de management de la qualité").category(TrainingCat.SYSTEME_MANAGEMENT_DE_LA_QUALITE).build(),
//                    TrainingFalse.builder().titled("Audit interne ISO 9001:2015").category(TrainingCat.SYSTEME_MANAGEMENT_DE_LA_QUALITE).build(),
//                    TrainingFalse.builder().titled("Transition vers ISO 9001:2015").category(TrainingCat.SYSTEME_MANAGEMENT_DE_LA_QUALITE).build(),
//                    TrainingFalse.builder().titled("Exigences de la norme ISO 9001:2015").category(TrainingCat.SYSTEME_MANAGEMENT_DE_LA_QUALITE).build(),
//                    TrainingFalse.builder().titled("Indicateurs et tableaux de bord Gestion des processus externalisés").category(TrainingCat.SYSTEME_MANAGEMENT_DE_LA_QUALITE).build(),
//                    TrainingFalse.builder().titled("Analyse des risques selon ISO 31000").category(TrainingCat.SYSTEME_MANAGEMENT_DE_LA_QUALITE).build(),
//                    TrainingFalse.builder().titled("Démarche de mise en place SMQ").category(TrainingCat.SYSTEME_MANAGEMENT_DE_LA_QUALITE).build(),
//                    TrainingFalse.builder().titled("Démarche 5S").category(TrainingCat.SYSTEME_MANAGEMENT_DE_LA_QUALITE).build(),
//                    TrainingFalse.builder().titled("Traitement des réclamations").category(TrainingCat.SYSTEME_MANAGEMENT_DE_LA_QUALITE).build(),
//                    TrainingFalse.builder().titled("Méthode ISHIKIWA").category(TrainingCat.SYSTEME_MANAGEMENT_DE_LA_QUALITE).build(),
//                    TrainingFalse.builder().titled("Gestion des informations documentées").category(TrainingCat.SYSTEME_MANAGEMENT_DE_LA_QUALITE).build(),
//                    TrainingFalse.builder().titled("Gestion des stocks et des approvisionnements").category(TrainingCat.SYSTEME_MANAGEMENT_DE_LA_QUALITE).build(),
//                    TrainingFalse.builder().titled("Pratique de l’AMDEC").category(TrainingCat.SYSTEME_MANAGEMENT_DE_LA_QUALITE).build(),
//                    TrainingFalse.builder().titled("Lean Six Sigma").category(TrainingCat.SYSTEME_MANAGEMENT_DE_LA_QUALITE).build(),
//                    TrainingFalse.builder().titled("Formation des responsables qualités").category(TrainingCat.SYSTEME_MANAGEMENT_DE_LA_QUALITE).build(),
//
//                    TrainingFalse.builder().titled("Exigences de la norme OHSAS 18001").category(TrainingCat.SANTE_ET_SECURITE_DU_TRAVAIL).build(),
//                    TrainingFalse.builder().titled("Transition vers ISO 45001").category(TrainingCat.SANTE_ET_SECURITE_DU_TRAVAIL).build(),
//                    TrainingFalse.builder().titled("Audit interne SST").category(TrainingCat.SANTE_ET_SECURITE_DU_TRAVAIL).build(),
//                    TrainingFalse.builder().titled("Réglementation marocaine").category(TrainingCat.SANTE_ET_SECURITE_DU_TRAVAIL).build(),
//                    TrainingFalse.builder().titled("Prévention des risques SST").category(TrainingCat.SANTE_ET_SECURITE_DU_TRAVAIL).build(),
//                    TrainingFalse.builder().titled("Equipements de protection individuels").category(TrainingCat.SANTE_ET_SECURITE_DU_TRAVAIL).build(),
//                    TrainingFalse.builder().titled("Gestes et postures").category(TrainingCat.SANTE_ET_SECURITE_DU_TRAVAIL).build(),
//                    TrainingFalse.builder().titled("Sensibilisation aux risques ATEX").category(TrainingCat.SANTE_ET_SECURITE_DU_TRAVAIL).build(),
//                    TrainingFalse.builder().titled("Habilitation électrique").category(TrainingCat.SANTE_ET_SECURITE_DU_TRAVAIL).build(),
//                    TrainingFalse.builder().titled("Transport marchandises dangereuse ADR").category(TrainingCat.SANTE_ET_SECURITE_DU_TRAVAIL).build(),
//                    TrainingFalse.builder().titled("Sécurité incendie").category(TrainingCat.SANTE_ET_SECURITE_DU_TRAVAIL).build(),
//                    TrainingFalse.builder().titled("Secourisme").category(TrainingCat.SANTE_ET_SECURITE_DU_TRAVAIL).build(),
//                    TrainingFalse.builder().titled("Levage et manutention").category(TrainingCat.SANTE_ET_SECURITE_DU_TRAVAIL).build(),
//                    TrainingFalse.builder().titled("Conduite sécuritaire des appareils de levage").category(TrainingCat.SANTE_ET_SECURITE_DU_TRAVAIL).build(),
//                    TrainingFalse.builder().titled("Travaux en hauteur").category(TrainingCat.SANTE_ET_SECURITE_DU_TRAVAIL).build(),
//                    TrainingFalse.builder().titled("Risques chimiques").category(TrainingCat.SANTE_ET_SECURITE_DU_TRAVAIL).build(),
//                    TrainingFalse.builder().titled("Risques éléctriques").category(TrainingCat.SANTE_ET_SECURITE_DU_TRAVAIL).build(),
//                    TrainingFalse.builder().titled("Risque routier").category(TrainingCat.SANTE_ET_SECURITE_DU_TRAVAIL).build(),
//
//                    TrainingFalse.builder().titled("Exigences de la norme ISO 14001").category(TrainingCat.MANAGEMENT_ENVIRONNEMENTAL).build(),
//                    TrainingFalse.builder().titled("Transition vers ISO 14001:2015").category(TrainingCat.MANAGEMENT_ENVIRONNEMENTAL).build(),
//                    TrainingFalse.builder().titled("Audit interne ISO 14001:2015").category(TrainingCat.MANAGEMENT_ENVIRONNEMENTAL).build(),
//                    TrainingFalse.builder().titled("Réglementation environnementale").category(TrainingCat.MANAGEMENT_ENVIRONNEMENTAL).build(),
//                    TrainingFalse.builder().titled("Gestion des situations d’urgence").category(TrainingCat.MANAGEMENT_ENVIRONNEMENTAL).build(),
//                    TrainingFalse.builder().titled("Identification des impacts environnementaux").category(TrainingCat.MANAGEMENT_ENVIRONNEMENTAL).build(),
//                    TrainingFalse.builder().titled("Analyse du cycle de vie").category(TrainingCat.MANAGEMENT_ENVIRONNEMENTAL).build(),
//                    TrainingFalse.builder().titled("Gestion des déchets").category(TrainingCat.MANAGEMENT_ENVIRONNEMENTAL).build(),
//                    TrainingFalse.builder().titled("Principes RSE").category(TrainingCat.MANAGEMENT_ENVIRONNEMENTAL).build(),
//                    TrainingFalse.builder().titled("Efficacité énergétique selon ISO 50001").category(TrainingCat.MANAGEMENT_ENVIRONNEMENTAL).build(),
//                    TrainingFalse.builder().titled("Bilan énergétique").category(TrainingCat.MANAGEMENT_ENVIRONNEMENTAL).build(),
//                    TrainingFalse.builder().titled("Principes d’éco-conception").category(TrainingCat.MANAGEMENT_ENVIRONNEMENTAL).build(),
//                    TrainingFalse.builder().titled("Analyse énergétique des bâtiments, des installations et des équipements").category(TrainingCat.MANAGEMENT_ENVIRONNEMENTAL).build(),
//                    TrainingFalse.builder().titled("Démarche d’optimisation des consommations énergétiques").category(TrainingCat.MANAGEMENT_ENVIRONNEMENTAL).build(),
//
//                    TrainingFalse.builder().titled("Exigences de ISO 22000").category(TrainingCat.HYGIENE_SECURITE_ALIMENTAIRE).build(),
//                    TrainingFalse.builder().titled("Bonne Pratiques d’Hygiène").category(TrainingCat.HYGIENE_SECURITE_ALIMENTAIRE).build(),
//                    TrainingFalse.builder().titled("Démarche HACCP").category(TrainingCat.HYGIENE_SECURITE_ALIMENTAIRE).build(),
//                    TrainingFalse.builder().titled("Audit interne ISO 22000").category(TrainingCat.HYGIENE_SECURITE_ALIMENTAIRE).build(),
//                    TrainingFalse.builder().titled("Réglementation sécurité alimentaire").category(TrainingCat.HYGIENE_SECURITE_ALIMENTAIRE).build(),
//                    TrainingFalse.builder().titled("Détermination des CCP et des PRPo").category(TrainingCat.HYGIENE_SECURITE_ALIMENTAIRE).build(),
//                    TrainingFalse.builder().titled("Maîtrise des risques sanitaires").category(TrainingCat.HYGIENE_SECURITE_ALIMENTAIRE).build(),
//                    TrainingFalse.builder().titled("Exigences FSSC 22000").category(TrainingCat.HYGIENE_SECURITE_ALIMENTAIRE).build(),
//                    TrainingFalse.builder().titled("Mise en place de BR").category(TrainingCat.HYGIENE_SECURITE_ALIMENTAIRE).build(),
//                    TrainingFalse.builder().titled("Mise en place de IFS").category(TrainingCat.HYGIENE_SECURITE_ALIMENTAIRE).build(),
//                    TrainingFalse.builder().titled("Labélisation HALALn").category(TrainingCat.HYGIENE_SECURITE_ALIMENTAIRE).build(),
//
//                    TrainingFalse.builder().titled("Management de la production").category(TrainingCat.TECHNIQUE_ET_INDUSTRIEL).build(),
//                    TrainingFalse.builder().titled("Gestion de la maintenance").category(TrainingCat.TECHNIQUE_ET_INDUSTRIEL).build(),
//                    TrainingFalse.builder().titled("Dessin industriel").category(TrainingCat.TECHNIQUE_ET_INDUSTRIEL).build(),
//                    TrainingFalse.builder().titled("Lean manufacturing").category(TrainingCat.TECHNIQUE_ET_INDUSTRIEL).build(),
//                    TrainingFalse.builder().titled("AUTOCAD").category(TrainingCat.TECHNIQUE_ET_INDUSTRIEL).build(),
//                    TrainingFalse.builder().titled("Consignation électrique").category(TrainingCat.TECHNIQUE_ET_INDUSTRIEL).build(),
//                    TrainingFalse.builder().titled("Techniques de démontage et remontage").category(TrainingCat.TECHNIQUE_ET_INDUSTRIEL).build(),
//                    TrainingFalse.builder().titled("Métrologie").category(TrainingCat.TECHNIQUE_ET_INDUSTRIEL).build(),
//                    TrainingFalse.builder().titled("Surveillance des installations").category(TrainingCat.TECHNIQUE_ET_INDUSTRIEL).build(),
//                    TrainingFalse.builder().titled("KAIZEN Management").category(TrainingCat.TECHNIQUE_ET_INDUSTRIEL).build(),
//                    TrainingFalse.builder().titled("Mise en place de EN 9100").category(TrainingCat.TECHNIQUE_ET_INDUSTRIEL).build(),
//                    TrainingFalse.builder().titled("Mise en place ISO TS 16949").category(TrainingCat.TECHNIQUE_ET_INDUSTRIEL).build(),
//                    TrainingFalse.builder().titled("Dessin des plans isométrique").category(TrainingCat.TECHNIQUE_ET_INDUSTRIEL).build(),
//                    TrainingFalse.builder().titled("TEKLA: Calcul de structures").category(TrainingCat.TECHNIQUE_ET_INDUSTRIEL).build(),
//                    TrainingFalse.builder().titled("Mellinium: calcul charpente métalique").category(TrainingCat.TECHNIQUE_ET_INDUSTRIEL).build(),
//
//                    TrainingFalse.builder().titled("Management de projet").category(TrainingCat.ADMINISTRATION_DES_ENTREPRISES).build(),
//                    TrainingFalse.builder().titled("Contrôle de gestion").category(TrainingCat.ADMINISTRATION_DES_ENTREPRISES).build(),
//                    TrainingFalse.builder().titled("Gestion budgétaire").category(TrainingCat.ADMINISTRATION_DES_ENTREPRISES).build(),
//                    TrainingFalse.builder().titled("Comptabilité générale & analytique").category(TrainingCat.ADMINISTRATION_DES_ENTREPRISES).build(),
//                    TrainingFalse.builder().titled("Gestion de la trésorerie").category(TrainingCat.ADMINISTRATION_DES_ENTREPRISES).build(),
//                    TrainingFalse.builder().titled("Nouveauté fiscale et juridique").category(TrainingCat.ADMINISTRATION_DES_ENTREPRISES).build(),
//                    TrainingFalse.builder().titled("Législation du travail").category(TrainingCat.ADMINISTRATION_DES_ENTREPRISES).build(),
//                    TrainingFalse.builder().titled("Maîtrise des incoterms").category(TrainingCat.ADMINISTRATION_DES_ENTREPRISES).build(),
//                    TrainingFalse.builder().titled("Management des équipes").category(TrainingCat.ADMINISTRATION_DES_ENTREPRISES).build(),
//                    TrainingFalse.builder().titled("Ingénierie et développement des compétences").category(TrainingCat.ADMINISTRATION_DES_ENTREPRISES).build(),
//                    TrainingFalse.builder().titled("Techniques de négociation").category(TrainingCat.ADMINISTRATION_DES_ENTREPRISES).build(),
//                    TrainingFalse.builder().titled("Techniques de communication").category(TrainingCat.ADMINISTRATION_DES_ENTREPRISES).build(),
//                    TrainingFalse.builder().titled("Veille concurrentielle").category(TrainingCat.ADMINISTRATION_DES_ENTREPRISES).build(),
//                    TrainingFalse.builder().titled("Microsoft office: Excel, word...").category(TrainingCat.ADMINISTRATION_DES_ENTREPRISES).build(),
//                    TrainingFalse.builder().titled("Intelligence économique").category(TrainingCat.ADMINISTRATION_DES_ENTREPRISES).build(),
//                    TrainingFalse.builder().titled("Sensibilisation à la sécurité des systèmes d’information Motivation d’équipe").category(TrainingCat.ADMINISTRATION_DES_ENTREPRISES).build(),
//                    TrainingFalse.builder().titled("Team building").category(TrainingCat.ADMINISTRATION_DES_ENTREPRISES).build(),
//                    TrainingFalse.builder().titled("Force de vùente").category(TrainingCat.ADMINISTRATION_DES_ENTREPRISES).build(),
//                    TrainingFalse.builder().titled("E-Marketing").category(TrainingCat.ADMINISTRATION_DES_ENTREPRISES).build()
//            );
//
//            trainingFalseRepository.saveAll(trainingFalses);
        };
    }

}
