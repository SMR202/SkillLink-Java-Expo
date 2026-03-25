package com.skilllink.dto.response;

import com.skilllink.entity.SkillCategory;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SkillCategoryResponse {
    private Long id;
    private String name;
    private String icon;

    public static SkillCategoryResponse from(SkillCategory category) {
        return SkillCategoryResponse.builder()
            .id(category.getId())
            .name(category.getName())
            .icon(category.getIcon())
            .build();
    }
}
