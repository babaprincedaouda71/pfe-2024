package org.example.invoicingservice.client;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.example.invoicingservice.model.Group;
import org.example.invoicingservice.model.Training;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "TRAINING-SERVICE")
public interface TrainingRest {
    @GetMapping("/training/find/{idTraining}")
    @CircuitBreaker(name = "trainingService", fallbackMethod = "getDefaultTraining")
    Training findTrainingById(@PathVariable Long idTraining);

    @GetMapping("/training/all")
    @CircuitBreaker(name = "trainingService", fallbackMethod = "getAllDefaultTrainings")
    List<Training> allTrainings();

    default Training getDefaultTraining(Long idTraining, Exception exception) {
        return new Training();
    }

    default List<Training> getAllDefaultTrainings(Exception exception){
        return List.of();
    }

    @PutMapping("/trainingGroup/updateGroupe")
    void markGroupAsInvoiced(@RequestBody Group group);
}
