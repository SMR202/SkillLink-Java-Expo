package com.skilllink.dto.response;

import com.skilllink.entity.Proposal;
import lombok.*;

import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProposalResponse {
    private Long id;
    private Long jobPostId;
    private String jobTitle;
    private Long providerId;
    private String providerName;
    private String providerAvatarUrl;
    private Double providerRating;
    private String coverMessage;
    private BigDecimal proposedPrice;
    private String estimatedDeliveryTime;
    private String status;
    private Long bookingId;
    private String createdAt;

    public static ProposalResponse from(Proposal proposal) {
        return ProposalResponse.builder()
            .id(proposal.getId())
            .jobPostId(proposal.getJobPost().getId())
            .jobTitle(proposal.getJobPost().getTitle())
            .providerId(proposal.getProvider().getId())
            .providerName(proposal.getProvider().getUser().getFullName())
            .providerAvatarUrl(proposal.getProvider().getAvatarUrl())
            .providerRating(proposal.getProvider().getAvgRating())
            .coverMessage(proposal.getCoverMessage())
            .proposedPrice(proposal.getProposedPrice())
            .estimatedDeliveryTime(proposal.getEstimatedDeliveryTime())
            .status(proposal.getStatus().name())
            .bookingId(proposal.getBooking() != null ? proposal.getBooking().getId() : null)
            .createdAt(proposal.getCreatedAt().toString())
            .build();
    }
}
