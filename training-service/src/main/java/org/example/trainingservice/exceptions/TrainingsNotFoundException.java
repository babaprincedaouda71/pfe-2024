package org.example.trainingservice.exceptions;

public class TrainingsNotFoundException extends RuntimeException {
    public TrainingsNotFoundException(String message) {
        super(message);
    }
}
