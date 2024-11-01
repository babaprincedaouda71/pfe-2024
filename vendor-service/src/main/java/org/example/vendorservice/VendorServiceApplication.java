package org.example.vendorservice;

import org.example.vendorservice.entity.Vendor;
import org.example.vendorservice.enums.Services;
import org.example.vendorservice.enums.Status;
import org.example.vendorservice.repo.VendorRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.util.Date;
import java.util.Random;

@SpringBootApplication
public class VendorServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(VendorServiceApplication.class, args);
    }

//    @Bean
//    CommandLineRunner commandLineRunner(VendorRepo vendorRepo){
//        return args -> {
//            Vendor Vendor = new Vendor();
//            Vendor.setPhone("1234567890");
//            Vendor.setEmail("aaa@aaa.com");
//            Vendor.setCreatedAt(LocalDate.now());
//            Vendor.setBankAccountNumber("00215606689064594");
//            Vendor.setDeadline(40L);
//            Vendor.setService(Services.SERVICE);
//            Vendor.setSubject("Vendor Object");
//            Vendor.setCnss("09595909848");
//            Vendor.setSubject("Finance");
//            Vendor.setAddress("123 Main St");
//            Vendor.setName("Baba Prince");
//            Vendor.setNic("BK12273Z");
//            Vendor.setTp("6565656");
//            Vendor.setFi("464646");
//            Vendor.setIce("8898998899");
//            Vendor.setRc("566565595");
//            Vendor.setStatus(Status.INDIVIDUAL);
//            Vendor.setSubject("MMM");
//            vendorRepo.save(Vendor);
//
//            Random random = new Random();
//
//            for (int i = 1; i <= 3; i++) {
//                Vendor vendor = new Vendor();
//                vendor.setPhone(generatePhoneNumber());
//                vendor.setEmail("vendor" + i + "@email.com");
//                vendor.setCreatedAt(LocalDate.now());
//                vendor.setBankAccountNumber(generateBankAccountNumber());
//                vendor.setDeadline(random.nextLong());
//                vendor.setService(Services.values()[random.nextInt(Services.values().length)]);
//                vendor.setCnss(generateCnss());
//                vendor.setSubject("Finance");
//                vendor.setAddress(generateAddress());
//                vendor.setName("Vendor " + i);
//                vendor.setNic(generateNic());
//                vendor.setTp(generateTp());
//                vendor.setFi(generateFi());
//                vendor.setIce(generateIce());
//                vendor.setRc(generateRc());
//                vendor.setStatus(Status.values()[random.nextInt(Status.values().length)]);
//                vendorRepo.save(vendor);
//            }
//        };
//    }
//
//    // Generate random phone number
//    private static String generatePhoneNumber() {
//        Random random = new Random();
//        return String.format("%010d", random.nextInt(10000));
//    }
//
//    // Generate random bank account number
//    private static String generateBankAccountNumber() {
//        Random random = new Random();
//        return String.format("%020d", random.nextLong());
//    }
//
//    // Generate random CNSS number
//    private static String generateCnss() {
//        Random random = new Random();
//        return String.format("%011d", random.nextInt(10000));
//    }
//
//    // Generate random address
//    private static String generateAddress() {
//        String[] streets = {"Main St", "Elm St", "Maple Ave", "Oak St", "Pine St"};
//        Random random = new Random();
//        return random.nextInt(100) + " " + streets[random.nextInt(streets.length)];
//    }
//
//    // Generate random NIC number
//    private static String generateNic() {
//        Random random = new Random();
//        return "BK" + random.nextInt(100000) + "Z";
//    }
//
//    // Generate random TP number
//    private static String generateTp() {
//        Random random = new Random();
//        return String.format("%07d", random.nextInt(10000));
//    }
//
//    // Generate random FI number
//    private static String generateFi() {
//        Random random = new Random();
//        return String.format("%06d", random.nextInt(10000));
//    }
//
//    // Generate random ICE number
//    private static String generateIce() {
//        Random random = new Random();
//        return String.format("%010d", random.nextInt(10000));
//    }
//
//    // Generate random RC number
//    private static String generateRc() {
//        Random random = new Random();
//        return String.format("%09d", random.nextInt(10000));
//    }


}
