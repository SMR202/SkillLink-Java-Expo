package com.skilllink.dto.response;

import com.skilllink.entity.JobPost;
import lombok.*;

import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class JobPostResponse {
    private Long id;
    private Long clientId;
    private String clientName;
    private Long categoryId;
    private String categoryName;
    private String title;
    private String description;
    private BigDecimal budget;
    private String location;
    private String deadline;
    private String status;
    private int proposalCount;
    private String createdAt;

    public static JobPostResponse from(JobPost job) {
        return JobPostResponse.builder()
            .id(job.getId())
            .clientId(job.getClient().getId())
            .clientName(job.getClient().getFullName())
            .categoryId(job.getCategory().getId())
            .categoryName(job.getCategory().getName())
            .title(job.getTitle())
            .description(job.getDescription())
            .budget(job.getBudget())
            .location(job.getLocation())
            .deadline(job.getDeadline() != null ? job.getDeadline().toString() : null)
            .status(job.getStatus().name())
            .proposalCount(job.getProposals() != null ? job.getProposals().size() : 0)
            .createdAt(job.getCreatedAt().toString())
            .build();
    }
}
