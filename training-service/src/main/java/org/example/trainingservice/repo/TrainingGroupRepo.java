package org.example.trainingservice.repo;

import org.example.trainingservice.entity.Training;
import org.example.trainingservice.entity.TrainingGroup;
import org.example.trainingservice.enums.TrainingGroupStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingGroupRepo extends JpaRepository<TrainingGroup, Long> {
    @Modifying
    @Query("DELETE FROM TrainingGroup tg WHERE tg.training = :training")
    void deleteTrainingGroups(@Param("training") Training training);

    List<TrainingGroup> findTrainingGroupsByStatus(TrainingGroupStatus status);
}
