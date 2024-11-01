package org.example.instructor.exceptions;

public class InstructorsNotFoundException extends RuntimeException{
    public InstructorsNotFoundException(String message) {
        super(message);
    }
}
