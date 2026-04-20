package com.port.logistics.config;

import com.port.logistics.entity.User;
import com.port.logistics.entity.enums.UserRole;
import com.port.logistics.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            System.out.println("🌱 SEEDING DEFAULT USERS...");

            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@port.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(UserRole.ADMIN);
            admin.setCreatedAt(LocalDateTime.now());

            User shipping = new User();
            shipping.setUsername("shipping");
            shipping.setEmail("shipping@port.com");
            shipping.setPassword(passwordEncoder.encode("shipping123"));
            shipping.setRole(UserRole.SHIPPING_LINE);
            shipping.setCreatedAt(LocalDateTime.now());

            User customs = new User();
            customs.setUsername("customs");
            customs.setEmail("customs@port.com");
            customs.setPassword(passwordEncoder.encode("customs123"));
            customs.setRole(UserRole.CUSTOMS_OFFICER);
            customs.setCreatedAt(LocalDateTime.now());

            userRepository.saveAll(Arrays.asList(admin, shipping, customs));

            System.out.println("✅ USERS SEEDED SUCCESSFULLY!");
            System.out.println("Login Credentials Created:");
            System.out.println("-> admin / admin123");
            System.out.println("-> shipping / shipping123");
            System.out.println("-> customs / customs123");
        }
    }
}
