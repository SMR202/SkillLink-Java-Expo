package com.skilllink.repository;

import com.skilllink.entity.JobPost;
import com.skilllink.entity.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobPostRepository extends JpaRepository<JobPost, Long> {
    Page<JobPost> findByStatusOrderByCreatedAtDesc(JobStatus status, Pageable pageable);
    Page<JobPost> findByClientIdOrderByCreatedAtDesc(Long clientId, Pageable pageable);
    long countByStatus(JobStatus status);
}
