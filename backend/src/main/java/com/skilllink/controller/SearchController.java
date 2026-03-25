package com.skilllink.controller;

import com.skilllink.dto.response.ApiResponse;
import com.skilllink.dto.response.ProviderResponse;
import com.skilllink.service.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final ProviderService providerService;

    @GetMapping("/providers")
    public ResponseEntity<ApiResponse<Page<ProviderResponse>>> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double minRating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<ProviderResponse> results = providerService.searchProviders(
            q, categoryId, city, minRating, PageRequest.of(page, size));

        return ResponseEntity.ok(ApiResponse.success(results));
    }
}
