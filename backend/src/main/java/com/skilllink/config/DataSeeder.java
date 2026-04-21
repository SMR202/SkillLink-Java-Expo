package com.skilllink.config;

import com.skilllink.entity.Role;
import com.skilllink.entity.User;
import com.skilllink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Seed ADMIN user if not exists
        if (!userRepository.existsByEmail("admin@skilllink.com")) {
            User admin = User.builder()
                .fullName("Admin User")
                .email("admin@skilllink.com")
                .passwordHash(passwordEncoder.encode("Admin@1234"))
                .role(Role.ADMIN)
                .emailVerified(true)
                .isActive(true)
                .build();
            userRepository.save(admin);
            System.out.println("✅ Admin user seeded: admin@skilllink.com / Admin@1234");
        }
    }
}
