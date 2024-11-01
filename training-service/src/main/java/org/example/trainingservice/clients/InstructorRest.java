package org.example.trainingservice.clients;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.example.trainingservice.model.Instructor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "INSTRUCTOR-SERVICE")
public interface InstructorRest {
    @GetMapping("/instructor/find/{idInstructor}")
    @CircuitBreaker(name = "instructorService", fallbackMethod = "getDefaultInstructor")
    Instructor findInstructorById(@PathVariable Long idInstructor);

    @GetMapping("/instructor/all")
    @CircuitBreaker(name = "instructorService", fallbackMethod = "getDefaultInstructors")
    List<Instructor> all();

    default Instructor getDefaultInstructor(Long idInstructor, Exception exception){
        Instructor instructor = new Instructor();
        instructor.setIdInstructor(idInstructor);
        instructor.setFirstName("Not Available");
        instructor.setLastName("Not Available");
        instructor.setEmail("Not Available");
        return instructor;
    }

    default List<Instructor> getDefaultInstructors(Exception exception) {
        return List.of();
    }
}
