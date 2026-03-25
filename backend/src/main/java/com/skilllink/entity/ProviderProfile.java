package com.skilllink.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "provider_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProviderProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 2000)
    private String bio;

    private String avatarUrl;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "provider_skills",
        joinColumns = @JoinColumn(name = "provider_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @Builder.Default
    private List<SkillCategory> skills = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "provider_portfolio_links", joinColumns = @JoinColumn(name = "provider_id"))
    @Column(name = "link_url")
    @Builder.Default
    private List<String> portfolioLinks = new ArrayList<>();

    private String city;

    @Column(nullable = false)
    @Builder.Default
    private Double avgRating = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalReviews = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isVerified = false;

    private String phoneNumber;

    @Column(nullable = false)
    @Builder.Default
    private Boolean profileComplete = false;
}
