package org.example.trainingservice.repo;

import org.example.trainingservice.entity.TrainingLifeCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainingLifeCycleRepo extends JpaRepository<TrainingLifeCycle, Long> {
}
