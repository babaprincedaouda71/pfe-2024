package org.example.instructor.mapper;

import lombok.AllArgsConstructor;
import org.example.instructor.dto.InstructorDTO;
import org.example.instructor.entity.Instructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class InstructorMapper {
    private final ModelMapper modelMapper = new ModelMapper();

    public InstructorDTO fromInstructor(Instructor instructor) {
        return modelMapper.map(instructor, InstructorDTO.class);
    }

    public Instructor fromInstructorDTO(InstructorDTO instructorDTO) {
        return modelMapper.map(instructorDTO, Instructor.class);
    }
}
