package com.skilllink.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skill_categories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SkillCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String icon; // icon identifier for frontend

    private String description;
}
