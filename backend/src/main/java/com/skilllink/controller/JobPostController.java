package com.skilllink.controller;

import com.skilllink.dto.request.JobPostRequest;
import com.skilllink.dto.response.ApiResponse;
import com.skilllink.dto.response.JobPostResponse;
import com.skilllink.security.JwtTokenProvider;
import com.skilllink.service.JobPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobPostController {

    private final JobPostService jobPostService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping
    public ResponseEntity<ApiResponse<JobPostResponse>> create(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody JobPostRequest request) {
        JobPostResponse response = jobPostService.create(getUserId(authHeader), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Job posted successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<JobPostResponse>>> getOpenJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(jobPostService.getOpenJobs(PageRequest.of(page, size))));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<Page<JobPostResponse>>> getMyJobs(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(jobPostService.getMyJobs(getUserId(authHeader), PageRequest.of(page, size))));
    }

    private Long getUserId(String authHeader) {
        return tokenProvider.getUserIdFromToken(authHeader.replace("Bearer ", ""));
    }
}
