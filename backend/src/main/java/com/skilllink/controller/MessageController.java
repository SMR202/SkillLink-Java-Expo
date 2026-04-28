package com.skilllink.controller;

import com.skilllink.dto.request.MessageRequest;
import com.skilllink.dto.response.ApiResponse;
import com.skilllink.dto.response.ConversationResponse;
import com.skilllink.dto.response.MessageResponse;
import com.skilllink.security.JwtTokenProvider;
import com.skilllink.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody MessageRequest request) {
        Long userId = getUserId(authHeader);
        MessageResponse response = messageService.sendMessage(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Message sent!", response));
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<List<MessageResponse>>> getMessages(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long bookingId) {
        Long userId = getUserId(authHeader);
        List<MessageResponse> messages = messageService.getMessages(userId, bookingId);
        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<ConversationResponse>>> getConversations(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = getUserId(authHeader);
        List<ConversationResponse> conversations = messageService.getConversations(userId);
        return ResponseEntity.ok(ApiResponse.success(conversations));
    }

    @PutMapping("/{bookingId}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long bookingId) {
        Long userId = getUserId(authHeader);
        messageService.markAsRead(userId, bookingId);
        return ResponseEntity.ok(ApiResponse.success("Messages marked as read", null));
    }

    private Long getUserId(String authHeader) {
        return tokenProvider.getUserIdFromToken(authHeader.replace("Bearer ", ""));
    }
}
