package org.example.trainingservice.service;

import org.example.trainingservice.entity.Mail;

public interface EmailService {

    String sendMail(Mail mail);
}
