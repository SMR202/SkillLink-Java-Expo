package com.skilllink.repository;

import com.skilllink.entity.Proposal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    boolean existsByJobPostIdAndProviderId(Long jobPostId, Long providerId);
    Page<Proposal> findByProviderIdOrderByCreatedAtDesc(Long providerId, Pageable pageable);
    List<Proposal> findByJobPostIdOrderByCreatedAtDesc(Long jobPostId);
}
