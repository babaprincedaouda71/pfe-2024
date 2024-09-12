package org.example.instructor.service;

import org.example.instructor.dto.InstructorDTO;

import java.util.List;

public interface InstructorService {
    InstructorDTO addInstructor(InstructorDTO instructorDTO);

    List<InstructorDTO> getInstructors();

    InstructorDTO getById(Long idInstructor);

    InstructorDTO updateInstructor(InstructorDTO instructorDTO);

    InstructorDTO deleteInstructor(Long idInstructor);
}
