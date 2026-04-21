package com.skilllink.dto.response;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AnalyticsResponse {
    private Long totalUsers;
    private Long totalClients;
    private Long totalProviders;
    private Long totalBookings;
    private Long pendingBookings;
    private Long completedBookings;
    private BigDecimal totalRevenue;
    private BigDecimal platformEarnings;
    private Long totalReviews;
    private Double averagePlatformRating;
}
