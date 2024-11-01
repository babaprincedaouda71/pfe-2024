package org.example.instructor.web;

import lombok.AllArgsConstructor;
import org.example.instructor.dto.InstructorDTO;
import org.example.instructor.service.InstructorService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/instructor")
@AllArgsConstructor
public class InstructorController {
    private InstructorService instructorService;

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('admin')")
    public InstructorDTO addInstructor(@RequestBody InstructorDTO instructorDTO) {
        System.out.println(instructorDTO.toString());
        return instructorService.addInstructor(instructorDTO);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('admin','user')")
    public List<InstructorDTO> getInstructors() {
        return instructorService.getInstructors();
    }

    @GetMapping("/find/{idInstructor}")
    @PreAuthorize("hasAnyAuthority('admin','user')")
    public InstructorDTO getById(@PathVariable Long idInstructor) {
        return instructorService.getById(idInstructor);
    }

    @PutMapping("/update")
    @PreAuthorize("hasAuthority('admin')")
    public InstructorDTO updateInstructor(@RequestBody InstructorDTO instructorDTO) {
        return instructorService.updateInstructor(instructorDTO);
    }

    @DeleteMapping("/delete/{idInstructor}")
    @PreAuthorize("hasAuthority('admin')")
    public InstructorDTO deleteInstructor(@PathVariable Long idInstructor) {
        return instructorService.deleteInstructor(idInstructor);
    }

    @GetMapping("/auth")
    public Authentication authentication(Authentication authentication) {
        return authentication;
    }
}
