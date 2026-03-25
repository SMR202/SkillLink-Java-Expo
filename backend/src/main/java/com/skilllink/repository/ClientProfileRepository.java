package com.skilllink.repository;

import com.skilllink.entity.ClientProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClientProfileRepository extends JpaRepository<ClientProfile, Long> {
    Optional<ClientProfile> findByUserId(Long userId);
}
