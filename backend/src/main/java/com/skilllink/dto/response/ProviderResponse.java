package com.skilllink.dto.response;

import com.skilllink.entity.ProviderProfile;
import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProviderResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String bio;
    private String avatarUrl;
    private List<SkillCategoryResponse> skills;
    private List<String> portfolioLinks;
    private String city;
    private Double avgRating;
    private Integer totalReviews;
    private Boolean isVerified;
    private String phoneNumber;
    private Boolean profileComplete;

    public static ProviderResponse from(ProviderProfile profile) {
        return ProviderResponse.builder()
            .id(profile.getId())
            .userId(profile.getUser().getId())
            .fullName(profile.getUser().getFullName())
            .email(profile.getUser().getEmail())
            .bio(profile.getBio())
            .avatarUrl(profile.getAvatarUrl())
            .skills(profile.getSkills().stream().map(SkillCategoryResponse::from).toList())
            .portfolioLinks(profile.getPortfolioLinks())
            .city(profile.getCity())
            .avgRating(profile.getAvgRating())
            .totalReviews(profile.getTotalReviews())
            .isVerified(profile.getIsVerified())
            .phoneNumber(profile.getPhoneNumber())
            .profileComplete(profile.getProfileComplete())
            .build();
    }

    // Summary version for search results
    public static ProviderResponse summary(ProviderProfile profile) {
        return ProviderResponse.builder()
            .id(profile.getId())
            .userId(profile.getUser().getId())
            .fullName(profile.getUser().getFullName())
            .avatarUrl(profile.getAvatarUrl())
            .skills(profile.getSkills().stream().map(SkillCategoryResponse::from).toList())
            .city(profile.getCity())
            .avgRating(profile.getAvgRating())
            .totalReviews(profile.getTotalReviews())
            .isVerified(profile.getIsVerified())
            .build();
    }
}
