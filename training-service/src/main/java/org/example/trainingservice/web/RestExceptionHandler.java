package org.example.trainingservice.web;
import org.example.trainingservice.exceptions.ApiError;
import org.example.trainingservice.exceptions.TrainingNotFoundException;
import org.example.trainingservice.exceptions.TrainingsNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController
@ControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(value = TrainingNotFoundException.class)
    public ResponseEntity<ApiError> handleTrainingNotFoundException(TrainingNotFoundException exception) {
        ApiError apiError = new ApiError(400, exception.getMessage(), new Date());
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = TrainingsNotFoundException.class)
    public ResponseEntity<ApiError> handleTrainingsNotFoundException(TrainingsNotFoundException exception) {
        ApiError apiError = new ApiError(400, exception.getMessage(), new Date());
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }
}
