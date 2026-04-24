package com.skilllink.service;

import com.skilllink.dto.request.JobPostRequest;
import com.skilllink.dto.response.JobPostResponse;
import com.skilllink.entity.*;
import com.skilllink.exception.BadRequestException;
import com.skilllink.exception.ResourceNotFoundException;
import com.skilllink.repository.JobPostRepository;
import com.skilllink.repository.SkillCategoryRepository;
import com.skilllink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class JobPostService {

    private final JobPostRepository jobPostRepository;
    private final UserRepository userRepository;
    private final SkillCategoryRepository skillCategoryRepository;

    @Transactional
    public JobPostResponse create(Long clientId, JobPostRequest request) {
        User client = userRepository.findById(clientId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (client.getRole() != Role.CLIENT) {
            throw new BadRequestException("Only clients can post jobs");
        }

        SkillCategory category = skillCategoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        LocalDate deadline = null;
        if (request.getDeadline() != null && !request.getDeadline().isBlank()) {
            deadline = LocalDate.parse(request.getDeadline());
            if (deadline.isBefore(LocalDate.now())) {
                throw new BadRequestException("Deadline cannot be in the past");
            }
        }

        JobPost job = JobPost.builder()
            .client(client)
            .category(category)
            .title(request.getTitle())
            .description(request.getDescription())
            .budget(request.getBudget())
            .location(request.getLocation())
            .deadline(deadline)
            .status(JobStatus.OPEN)
            .build();

        return JobPostResponse.from(jobPostRepository.save(job));
    }

    public Page<JobPostResponse> getOpenJobs(Pageable pageable) {
        return jobPostRepository.findByStatusOrderByCreatedAtDesc(JobStatus.OPEN, pageable)
            .map(JobPostResponse::from);
    }

    public Page<JobPostResponse> getMyJobs(Long clientId, Pageable pageable) {
        return jobPostRepository.findByClientIdOrderByCreatedAtDesc(clientId, pageable)
            .map(JobPostResponse::from);
    }

    public JobPost getJobOrThrow(Long id) {
        return jobPostRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
    }
}
