package com.skilllink.controller;

import com.skilllink.dto.request.ProposalAcceptRequest;
import com.skilllink.dto.request.ProposalRequest;
import com.skilllink.dto.response.ApiResponse;
import com.skilllink.dto.response.BookingResponse;
import com.skilllink.dto.response.ProposalResponse;
import com.skilllink.security.JwtTokenProvider;
import com.skilllink.service.ProposalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProposalController {

    private final ProposalService proposalService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/jobs/{jobId}/proposals")
    public ResponseEntity<ApiResponse<ProposalResponse>> submit(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long jobId,
            @Valid @RequestBody ProposalRequest request) {
        ProposalResponse response = proposalService.submit(getUserId(authHeader), jobId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Proposal sent", response));
    }

    @GetMapping("/jobs/{jobId}/proposals")
    public ResponseEntity<ApiResponse<List<ProposalResponse>>> getForJob(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long jobId) {
        return ResponseEntity.ok(ApiResponse.success(proposalService.getForJob(getUserId(authHeader), jobId)));
    }

    @GetMapping("/proposals/my")
    public ResponseEntity<ApiResponse<Page<ProposalResponse>>> getMine(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(proposalService.getMine(getUserId(authHeader), PageRequest.of(page, size))));
    }

    @PutMapping("/proposals/{proposalId}/accept")
    public ResponseEntity<ApiResponse<BookingResponse>> accept(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long proposalId,
            @Valid @RequestBody ProposalAcceptRequest request) {
        BookingResponse response = proposalService.accept(getUserId(authHeader), proposalId, request);
        return ResponseEntity.ok(ApiResponse.success("Proposal accepted and booking created", response));
    }

    private Long getUserId(String authHeader) {
        return tokenProvider.getUserIdFromToken(authHeader.replace("Bearer ", ""));
    }
}
