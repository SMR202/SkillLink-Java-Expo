package com.skilllink.repository;

import com.skilllink.entity.User;
import com.skilllink.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByPasswordResetToken(String token);

    // Sprint 3: Admin queries
    Page<User> findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
        String name, String email, Pageable pageable);
    Page<User> findByRole(Role role, Pageable pageable);
    long countByRole(Role role);
}
