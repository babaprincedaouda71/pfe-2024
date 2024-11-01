package org.example.trainingservice.exceptions;

public class TrainingGroupNotFoundException extends RuntimeException {
    public TrainingGroupNotFoundException(String message) {
        super(message);
    }
}
