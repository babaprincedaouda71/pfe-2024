//package org.example.trainingservice.service;
//
//import jakarta.mail.internet.MimeMessage;
//import org.example.trainingservice.entity.Mail;
//import org.example.trainingservice.repo.MailRepo;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.mail.javamail.MimeMessageHelper;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//@Service
//@Transactional
//public class EmailServiceImpl implements EmailService {
//  @Value("${spring.mail.username}")
//  private String from;
//
//  private final JavaMailSender javaMailSender;
//  private final MailRepo mailRepo;
//
//  public EmailServiceImpl(JavaMailSender javaMailSender, MailRepo mailRepo) {
//    this.javaMailSender = javaMailSender;
//    this.mailRepo = mailRepo;
//  }
//
//  @Override
//  public String sendMail(Mail mail) {
//    try {
//      MimeMessage mimeMessage = javaMailSender.createMimeMessage();
//
//      MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
//
//      mimeMessageHelper.setFrom(from);
//      mimeMessageHelper.setTo(mail.getReceiver());
//      mimeMessageHelper.setSubject(mail.getSubject());
//      mimeMessageHelper.setText(mail.getBody());
//
//      javaMailSender.send(mimeMessage);
//      mailRepo.save(mail);
//
//      return "Mail Send Success";
//    } catch (Exception e) {
//      throw new RuntimeException(e);
//    }
//  }
//}
