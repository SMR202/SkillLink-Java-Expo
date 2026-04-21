package com.skilllink.controller;

import com.skilllink.dto.request.ReviewRequest;
import com.skilllink.dto.response.ApiResponse;
import com.skilllink.dto.response.ReviewResponse;
import com.skilllink.security.JwtTokenProvider;
import com.skilllink.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> submitReview(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody ReviewRequest request) {
        Long userId = getUserId(authHeader);
        ReviewResponse response = reviewService.submitReview(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Review submitted successfully!", response));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<ApiResponse<Page<ReviewResponse>>> getProviderReviews(
            @PathVariable Long providerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ReviewResponse> reviews = reviewService.getProviderReviews(providerId, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @PutMapping("/{id}/respond")
    public ResponseEntity<ApiResponse<ReviewResponse>> respondToReview(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> body) {
        Long userId = getUserId(authHeader);
        ReviewResponse response = reviewService.respondToReview(userId, id, body.get("response"));
        return ResponseEntity.ok(ApiResponse.success("Response added!", response));
    }

    private Long getUserId(String authHeader) {
        return tokenProvider.getUserIdFromToken(authHeader.replace("Bearer ", ""));
    }
}
