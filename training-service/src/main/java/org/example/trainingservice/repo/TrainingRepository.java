package org.example.trainingservice.repo;

import org.example.trainingservice.entity.Training;
import org.example.trainingservice.enums.TrainingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TrainingRepository extends JpaRepository<Training, Long> {
    @Override
    void delete(Training training);

    // Méthode pour récupérer les formations avec le statut "Facturation"
    List<Training> findByStatus(TrainingStatus status);

    @Query("SELECT t FROM Training t WHERE t.status IN :statuses AND t.idClient = :idClient")
    List<Training> findByStatusInAndIdClient(List<TrainingStatus> statuses, Long idClient);

    @Query("SELECT t FROM Training t WHERE t.idClient = :idClient")
    List<Training> findByIdClient(Long idClient);
}
