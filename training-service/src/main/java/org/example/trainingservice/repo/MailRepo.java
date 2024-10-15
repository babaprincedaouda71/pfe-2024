package org.example.trainingservice.repo;

import org.example.trainingservice.entity.Mail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

//@Repository
public interface MailRepo extends JpaRepository<Mail, Long> {
}
