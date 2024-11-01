package org.example.trainingservice.mapper;

import org.example.trainingservice.dto.AddTrainingDTO;
import org.example.trainingservice.dto.TrainingDTO;
import org.example.trainingservice.dto.TrainingInvoiceDTO;
import org.example.trainingservice.entity.Training;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class TrainingMapper {
    private final ModelMapper modelMapper = new ModelMapper();

    public TrainingDTO fromTraining(Training trainingFalse) {
        return modelMapper.map(trainingFalse, TrainingDTO.class);
    }

    public AddTrainingDTO fromTrainingToAddTrainingDTO(Training training) {
        return modelMapper.map(training, AddTrainingDTO.class);
    }

    public Training fromTrainingDTO(TrainingDTO trainingDTO) {
        return modelMapper.map(trainingDTO, Training.class);
    }

    public Training fromAddTrainingDTO(AddTrainingDTO addTrainingDTO) {
        return modelMapper.map(addTrainingDTO, Training.class);
    }

    public TrainingInvoiceDTO toTrainingInvoiceDTO(Training training) {
        return modelMapper.map(training, TrainingInvoiceDTO.class);
    }
}
