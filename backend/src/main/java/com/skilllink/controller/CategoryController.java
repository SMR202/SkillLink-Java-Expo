package com.skilllink.controller;

import com.skilllink.dto.response.ApiResponse;
import com.skilllink.dto.response.SkillCategoryResponse;
import com.skilllink.repository.SkillCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final SkillCategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SkillCategoryResponse>>> getAllCategories() {
        List<SkillCategoryResponse> categories = categoryRepository.findAll()
            .stream()
            .map(SkillCategoryResponse::from)
            .toList();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }
}
