package org.example.instructor.service;

import lombok.AllArgsConstructor;
import org.example.instructor.dto.InstructorDTO;
import org.example.instructor.entity.Instructor;
import org.example.instructor.exceptions.InstructorNotFoundException;
import org.example.instructor.exceptions.InstructorsNotFoundException;
import org.example.instructor.mapper.InstructorMapper;
import org.example.instructor.repo.InstructorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class InstructorServiceImpl01 implements InstructorService {
    private InstructorRepository instructorRepository;
    private InstructorMapper instructorMapper;
    @Override
    public InstructorDTO addInstructor(InstructorDTO instructorDTO) {
        Instructor savedInstructor = instructorRepository.save(instructorMapper.fromInstructorDTO(instructorDTO));
        return instructorMapper.fromInstructor(savedInstructor);
    }

    @Override
    public List<InstructorDTO> getInstructors() {
        List<InstructorDTO> instructorDTOS = new ArrayList<>();
        List<Instructor> all = instructorRepository.findAll();
        all.forEach(instructor -> {
            instructorDTOS.add(instructorMapper.fromInstructor(instructor));
        });
        return instructorDTOS;
    }

    @Override
    public InstructorDTO getById(Long idInstructor) {
        Instructor instructor = instructorRepository.findById(idInstructor)
                .orElseThrow(() -> new InstructorNotFoundException("Instructor not found"));
        return instructorMapper.fromInstructor(instructor);
    }

    @Override
    public InstructorDTO updateInstructor(InstructorDTO instructorDTO) {
        instructorRepository.findById(instructorDTO.getIdInstructor())
                .orElseThrow(() -> new InstructorNotFoundException("Instructor Not Found"));
        Instructor save = instructorRepository.save(instructorMapper.fromInstructorDTO(instructorDTO));
        return instructorMapper.fromInstructor(save);
    }

    @Override
    public InstructorDTO deleteInstructor(Long idInstructor) {
        Instructor instructor = instructorRepository.findById(idInstructor)
                .orElseThrow(() -> new InstructorNotFoundException("Instructor Not Found"));
        instructorRepository.delete(instructor);
        return instructorMapper.fromInstructor(instructor);
    }
}
