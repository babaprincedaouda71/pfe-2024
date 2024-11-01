package org.example.clientservice;

import org.example.clientservice.entity.Client;
import org.example.clientservice.entity.Color;
import org.example.clientservice.repo.ClientRepository;
import org.example.clientservice.repo.ColorRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
public class ClientServiceApplication {

  public static void main(String[] args) {
    SpringApplication.run(ClientServiceApplication.class, args);
  }

//  @Bean
//  CommandLineRunner commandLineRunner(ClientRepository clientRepository, ColorRepo colorRepo) {
//    return args -> {
      // Colors
//      List<Color> colors = new ArrayList<>();
//
//      colors.add(Color.builder().code("#000000").build()); // Noir
//      colors.add(Color.builder().code("#4169E1").build()); // Bleu roi
//      colors.add(Color.builder().code("#000080").build()); // Bleu marine
//      colors.add(Color.builder().code("#006400").build()); // Vert foncé
//      colors.add(Color.builder().code("#4B0082").build()); // Violet foncé
//      colors.add(Color.builder().code("#4682B4").build()); // Bleu acier
//      colors.add(Color.builder().code("#228B22").build()); // Vert sapin
//      colors.add(Color.builder().code("#191970").build()); // Bleu nuit
//      colors.add(Color.builder().code("#2E2E2E").build()); // Gris anthracite
//      colors.add(Color.builder().code("#B22222").build()); // Rouge brique
//      colors.add(Color.builder().code("#0047AB").build()); // Bleu cobalt
//      colors.add(Color.builder().code("#50C878").build()); // Vert émeraude
//      colors.add(Color.builder().code("#2F4F4F").build()); // Bleu pétrole
//      colors.add(Color.builder().code("#7B1FA2").build()); // Pourpre impérial
//      colors.add(Color.builder().code("#003153").build()); // Bleu prussien
//      colors.add(Color.builder().code("#2F2F2F").build()); // Gris foncé
//      colors.add(Color.builder().code("#8B0000").build()); // Rouge foncé
//      colors.add(Color.builder().code("#4F86F7").build()); // Bleu myrtille
//      colors.add(Color.builder().code("#191970").build()); // Bleu de minuit
//      colors.add(Color.builder().code("#36454F").build()); // Gris charbon
//      colors.add(Color.builder().code("#3A3A3A").build()); // Gris plomb
//      colors.add(Color.builder().code("#8A0707").build()); // Rouge sang
//      colors.add(Color.builder().code("#0C1F3F").build()); // Bleu nuit foncé
//      colors.add(Color.builder().code("#2B2B2B").build()); // Gris graphite
//      colors.add(Color.builder().code("#1560BD").build()); // Bleu denim
//      colors.add(Color.builder().code("#8A9A5B").build()); // Vert mousse
//      colors.add(Color.builder().code("#333399").build()); // Bleu galaxie
//      colorRepo.saveAll(colors);
//
//      Client client =
//          Client.builder()
//              .corporateName("Galaxy Solutions")
//              .address("Park, Mohammedia")
//              .email("gs@gmail.com")
//              .phoneNumber("+212693823094")
//              .website("www.gs.ma")
//              .nameMainContact("Daoud Yassine")
//              .deadline(120)
//              .limitAmount(25000)
//              .cnss("45454654654")
//              .field("Etudes, Conseils, Formations")
//              .commercialRegister("54545465")
//              .commonCompanyIdentifier("0555454454545")
//              .emailMainContact("ydaoud@galaxysolutions.ma")
//              .positionMainContact("Directeur Général")
//              .professionalTax("54545454")
//              .taxRegistration("sfe2445")
//              .phoneNumberMainContact("+212 661160706")
//              .status("Actif")
//              .color("#8A9A5B")
//              .build();
//
//      Client client1 =
//          Client.builder()
//              .corporateName("Microsoft")
//              .address("Park, Palmeras")
//              .email("microsoft@gmail.com")
//              .phoneNumber("+1693823094")
//              .website("www.microsoft.ma")
//              .nameMainContact("Bill Gate")
//              .commonCompanyIdentifier("0555454454545")
//              .color("#000080")
//              .deadline(60)
//              .build();
//
//      Client client2 =
//          Client.builder()
//              .corporateName("Amazon")
//              .address("Park, Palmeras")
//              .email("amazon@gmail.com")
//              .phoneNumber("+1693823094")
//              .website("www.amazon.ma")
//              .commonCompanyIdentifier("0555454454545")
//              .nameMainContact("Jeff Bezos")
//              .color("#4169E1")
//              .deadline(80)
//              .build();
//
//      Client client3 =
//          Client.builder()
//              .corporateName("Google")
//              .address("123 Alphabet Street")
//              .email("google@gmail.com")
//              .phoneNumber("+1234567890")
//              .website("www.google.com")
//              .nameMainContact("Sundar Pichai")
//              .color("#000000")
//              .deadline(160)
//              .build();
//
//      Client client4 =
//          Client.builder()
//              .corporateName("Microsoft")
//              .address("One Microsoft Way")
//              .email("microsoft@hotmail.com")
//              .phoneNumber("+1987654321")
//              .website("www.microsoft.com")
//              .nameMainContact("Satya Nadella")
//              .build();
//
//      Client client5 =
//          Client.builder()
//              .corporateName("Apple")
//              .address("1 Apple Park Way")
//              .email("apple@apple.com")
//              .phoneNumber("+1650325678")
//              .website("www.apple.com")
//              .nameMainContact("Tim Cook")
//              .build();
//
//      Client client6 =
//          Client.builder()
//              .corporateName("Facebook")
//              .address("1 Hacker Way")
//              .email("facebook@gmail.com")
//              .phoneNumber("+1555123456")
//              .website("www.facebook.com")
//              .nameMainContact("Mark Zuckerberg")
//              .build();
//
//      Client client7 =
//          Client.builder()
//              .corporateName("Tesla")
//              .address("35 Deer Creek Road")
//              .email("tesla@tesla.com")
//              .phoneNumber("+1888888888")
//              .website("www.tesla.com")
//              .nameMainContact("Elon Musk")
//              .build();
//
//      Client client8 =
//          Client.builder()
//              .corporateName("Netflix")
//              .address("100 Winchester Circle")
//              .email("netflix@netflix.com")
//              .phoneNumber("+1666666666")
//              .website("www.netflix.com")
//              .nameMainContact("Reed Hastings")
//              .build();
//
//      Client client9 =
//          Client.builder()
//              .corporateName("Twitter")
//              .address("13 Market Street")
//              .email("twitter@twitter.com")
//              .phoneNumber("+1777777777")
//              .website("www.twitter.com")
//              .nameMainContact("Jack Dorsey")
//              .build();
//
//      Client client10 =
//          Client.builder()
//              .corporateName("Alibaba")
//              .address("969 West Wen Yi Road")
//              .email("alibaba@alibaba.com")
//              .phoneNumber("+1866666666")
//              .website("www.alibaba.com")
//              .nameMainContact("Jack Ma")
//              .build();
//
//      Client client11 =
//          Client.builder()
//              .corporateName("Samsung")
//              .address("129 Samsung-ro")
//              .email("samsung@gmail.com")
//              .phoneNumber("+82123456789")
//              .website("www.samsung.com")
//              .nameMainContact("Lee Kun-hee")
//              .build();
//
//      Client client12 =
//          Client.builder()
//              .corporateName("Intel")
//              .address("22 Mission College Blvd")
//              .email("intel@intel.com")
//              .phoneNumber("+14085551234")
//              .website("www.intel.com")
//              .nameMainContact("Pat Gelsinger")
//              .build();
//
//      Client client13 =
//          Client.builder()
//              .corporateName("Oracle")
//              .address("500 Oracle Parkway")
//              .email("oracle@oracle.com")
//              .phoneNumber("+16505551234")
//              .website("www.oracle.com")
//              .nameMainContact("Larry Ellison")
//              .build();
//
//      Client client14 =
//          Client.builder()
//              .corporateName("IBM")
//              .address("1 New Orchard Road")
//              .email("ibm@ibm.com")
//              .phoneNumber("+19195551234")
//              .website("www.ibm.com")
//              .nameMainContact("Arvind Krishna")
//              .build();
//
//      Client client15 =
//          Client.builder()
//              .corporateName("Uber")
//              .address("14 Market Street")
//              .email("uber@uber.com")
//              .phoneNumber("+18887776666")
//              .website("www.uber.com")
//              .nameMainContact("Dara Khosrowshahi")
//              .build();
//
//      Client client16 =
//          Client.builder()
//              .corporateName("Airbnb")
//              .address("888 Brannan Street")
//              .email("airbnb@airbnb.com")
//              .phoneNumber("+18888887777")
//              .website("www.airbnb.com")
//              .nameMainContact("Brian Chesky")
//              .build();
//
//      Client client17 =
//          Client.builder()
//              .corporateName("SpaceX")
//              .address("1 Rocket Road")
//              .email("spacex@spacex.com")
//              .phoneNumber("+13335557777")
//              .website("www.spacex.com")
//              .nameMainContact("Gwynne Shotwell")
//              .build();
//
//      Client client18 =
//          Client.builder()
//              .corporateName("Cisco")
//              .address("170 West Tasman Drive")
//              .email("cisco@cisco.com")
//              .phoneNumber("+14085557777")
//              .website("www.cisco.com")
//              .nameMainContact("Chuck Robbins")
//              .build();
//
//      Client client19 =
//          Client.builder()
//              .corporateName("HP")
//              .address("15 Page Mill Road")
//              .email("hp@hp.com")
//              .phoneNumber("+16504443333")
//              .website("www.hp.com")
//              .nameMainContact("Enrique Lores")
//              .build();
//
//      Client client20 =
//          Client.builder()
//              .corporateName("Dell")
//              .address("One Dell Way")
//              .email("dell@dell.com")
//              .phoneNumber("+15125554444")
//              .website("www.dell.com")
//              .nameMainContact("Michael Dell")
//              .build();
//
//      clientRepository.save(client);
//      clientRepository.save(client1);
//      clientRepository.save(client2);
      //      clientRepository.save(client3);
      //			clientRepository.save(client4);
      //			clientRepository.save(client5);
      //			clientRepository.save(client6);
      //			clientRepository.save(client7);
      //			clientRepository.save(client8);
      //			clientRepository.save(client9);
      //			clientRepository.save(client10);
      //			clientRepository.save(client11);
      //			clientRepository.save(client12);
      //			clientRepository.save(client13);
      //			clientRepository.save(client14);
      //			clientRepository.save(client15);
      //			clientRepository.save(client16);
      //			clientRepository.save(client17);
      //			clientRepository.save(client18);
      //			clientRepository.save(client19);
      //			clientRepository.save(client20);
//    };
//  }
}
