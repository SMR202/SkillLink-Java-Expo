package com.skilllink.service;

import com.skilllink.dto.request.MessageRequest;
import com.skilllink.dto.response.MessageResponse;
import com.skilllink.entity.*;
import com.skilllink.exception.*;
import com.skilllink.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Transactional
    public MessageResponse sendMessage(Long userId, MessageRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Verify sender is client or provider of this booking
        boolean isClient = booking.getClient().getId().equals(userId);
        boolean isProvider = booking.getProvider().getUser().getId().equals(userId);
        if (!isClient && !isProvider) {
            throw new ForbiddenException("You are not part of this booking");
        }

        // Verify booking status allows messaging
        if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new ForbiddenException("Messaging is only allowed for pending or accepted bookings");
        }

        User sender = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Message message = Message.builder()
            .booking(booking)
            .sender(sender)
            .content(request.getContent())
            .build();
        message = messageRepository.save(message);

        return mapToResponse(message);
    }

    public List<MessageResponse> getMessages(Long userId, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Verify user is part of this booking
        boolean isClient = booking.getClient().getId().equals(userId);
        boolean isProvider = booking.getProvider().getUser().getId().equals(userId);
        if (!isClient && !isProvider) {
            throw new ForbiddenException("You are not part of this booking");
        }

        return messageRepository.findByBookingIdOrderBySentAtAsc(bookingId)
            .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long userId, Long bookingId) {
        messageRepository.markAllAsReadForBooking(bookingId, userId);
    }

    private MessageResponse mapToResponse(Message message) {
        return MessageResponse.builder()
            .id(message.getId())
            .bookingId(message.getBooking().getId())
            .senderId(message.getSender().getId())
            .senderName(message.getSender().getFullName())
            .content(message.getContent())
            .isRead(message.getIsRead())
            .sentAt(message.getSentAt())
            .build();
    }
}
