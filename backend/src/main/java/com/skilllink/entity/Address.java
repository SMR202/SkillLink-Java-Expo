package com.skilllink.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "addresses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_profile_id", nullable = false)
    private ClientProfile clientProfile;

    private String label; // e.g. "Home", "Office"

    @Column(nullable = false)
    private String streetAddress;

    private String city;

    private String area;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isPrimary = false;
}
