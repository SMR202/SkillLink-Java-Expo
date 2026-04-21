package com.skilllink.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReviewResponse {
    private Long id;
    private Long bookingId;
    private Long clientId;
    private String clientName;
    private Long providerId;
    private String providerName;
    private Integer rating;
    private String comment;
    private String providerResponse;
    private LocalDateTime createdAt;
    private LocalDateTime respondedAt;
}
