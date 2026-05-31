package com.onlinelearning.backend.config;

import com.onlinelearning.backend.user.entity.Role;
import com.onlinelearning.backend.user.entity.User;
import com.onlinelearning.backend.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        // ================= USER =================
        if (userRepository.count() == 0) {

            System.out.println("👤 Seeding users...");

            // ADMIN
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("123456"));
            admin.setRole(Role.ADMIN);
            admin.setEmail("admin@gmail.com");
            userRepository.save(admin);

            // USER 1
            User user1 = new User();
            user1.setUsername("user1");
            user1.setPassword(passwordEncoder.encode("123456"));
            user1.setRole(Role.USER);
            user1.setEmail("user1@gmail.com");
            userRepository.save(user1);

            // USER 2
            User user2 = new User();
            user2.setUsername("user2");
            user2.setPassword(passwordEncoder.encode("123456"));
            user2.setRole(Role.USER);
            user2.setEmail("user2@gmail.com");
            userRepository.save(user2);

            // INSTRUCTOR
            User instructor = new User();
            instructor.setUsername("instructer");
            instructor.setPassword(passwordEncoder.encode("123456"));
            instructor.setRole(Role.INSTRUCTOR);
            instructor.setEmail("dangvanly270704@gmail.com");
            userRepository.save(instructor);

            // VANLY
            User vanly = new User();
            vanly.setUsername("vanly");
            vanly.setPassword(passwordEncoder.encode("123456"));
            vanly.setRole(Role.USER);
            vanly.setEmail("vanly987654321@gmail.com");
            userRepository.save(vanly);

            System.out.println("✅ USER SEEDED!");
        }
    }
}