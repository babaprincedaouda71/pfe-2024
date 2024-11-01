package org.example.trainingservice.web;

import org.example.trainingservice.entity.Mail;
import org.example.trainingservice.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/mail")
public class EmailController {
//    private final EmailService emailService;

//    public EmailController(EmailService emailService) {
//        this.emailService = emailService;
//    }

//    @PostMapping("/send")
//    public String sendMail(@RequestBody Mail mail) {
////        System.out.println(mail.toString());
//        return emailService.sendMail(mail);
//    }
}
