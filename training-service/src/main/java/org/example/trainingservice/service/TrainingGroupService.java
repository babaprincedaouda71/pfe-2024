package org.example.trainingservice.service;

import org.example.trainingservice.entity.TrainingGroup;

import java.util.List;

public interface TrainingGroupService {
    List<TrainingGroup> getAllTrainingGroups();

    TrainingGroup updateStatus(Long groupId, TrainingGroup trainingGroup, String status);
}