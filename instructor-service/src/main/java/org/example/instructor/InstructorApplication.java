package org.example.instructor;

import org.example.instructor.entity.Instructor;
import org.example.instructor.repo.InstructorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Arrays;
import java.util.List;

@SpringBootApplication
public class InstructorApplication {

    public static void main(String[] args) {
        SpringApplication.run(InstructorApplication.class, args);
    }

    @Bean
    CommandLineRunner start(InstructorRepository instructorRepository) {
        return args -> {
            List<Instructor> instructors = Arrays.asList(
                    Instructor.builder()
                            .firstName("Baba")
                            .lastName("Prince")
                            .email("babaprince71@gmail.com")
                            .phone("+212 693823094")
                            .address("789 Maple Avenue, Toronto, Canada\n")
                            .ice("ICE987654321")
                            .build(),

                    Instructor.builder()
                            .firstName("Boris")
                            .lastName("Samne")
                            .email("borissamne5@gmail.com")
                            .phone("+212 693823094")
                            .address("567 Pine Street, Berlin, Germany\n")
                            .ice("ICE123456789")
                            .build(),

                    Instructor.builder()
                            .firstName("Abdoul")
                            .lastName("Aziz")
                            .email("fatogomao66@gmail.com")
                            .phone("+212 693823094")
                            .address("654 Willow Drive, Madrid, Spain")
                            .ice("ICE246813579")
                            .build()
            );

            instructorRepository.saveAll(instructors);
        };
    }

}
