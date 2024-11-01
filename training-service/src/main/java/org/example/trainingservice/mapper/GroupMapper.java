package org.example.trainingservice.mapper;

import org.example.trainingservice.dto.TrainingGroupDTO;
import org.example.trainingservice.entity.TrainingGroup;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class GroupMapper {
    private final ModelMapper modelMapper = new ModelMapper();

    public TrainingGroupDTO fromTrainingGroup(TrainingGroup trainingGroup) {
        return modelMapper.map(trainingGroup, TrainingGroupDTO.class);
    }

    public TrainingGroup fromTrainingGroupDTO(TrainingGroupDTO trainingGroupDTO) {
        return modelMapper.map(trainingGroupDTO, TrainingGroup.class);
    }

    public TrainingGroupDTO fromTrainingGroupToDTO(TrainingGroup trainingGroup) {
        return modelMapper.map(trainingGroup, TrainingGroupDTO.class);
    }
}
