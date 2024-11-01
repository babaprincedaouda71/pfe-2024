package org.example.instructor.web;
import org.example.instructor.exceptions.ApiError;
import org.example.instructor.exceptions.InstructorNotFoundException;
import org.example.instructor.exceptions.InstructorsNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController
@ControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(value = InstructorNotFoundException.class)
    public ResponseEntity<ApiError> handleTrainingNotFoundException(InstructorNotFoundException exception) {
        ApiError apiError = new ApiError(400, exception.getMessage(), new Date());
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = InstructorsNotFoundException.class)
    public ResponseEntity<ApiError> handleTrainingsNotFoundException(InstructorsNotFoundException exception) {
        ApiError apiError = new ApiError(400, exception.getMessage(), new Date());
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }
}
