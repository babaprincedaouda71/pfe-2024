package org.example.instructor.exceptions;

public class InstructorNotFoundException extends RuntimeException{
    public InstructorNotFoundException(String message) {
        super(message);
    }
}
