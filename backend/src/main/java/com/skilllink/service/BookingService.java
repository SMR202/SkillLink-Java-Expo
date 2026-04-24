package com.skilllink.service;

import com.skilllink.dto.request.BookingActionRequest;
import com.skilllink.dto.request.BookingRequest;
import com.skilllink.dto.response.BookingResponse;
import com.skilllink.entity.*;
import com.skilllink.exception.*;
import com.skilllink.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final NotificationRepository notificationRepository;

    @Transactional
    public BookingResponse createBooking(Long clientId, BookingRequest request) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        if (client.getRole() != Role.CLIENT) {
            throw new BadRequestException("Only clients can create bookings.");
        }

        ProviderProfile provider = providerProfileRepository.findById(request.getProviderId())
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found."));

        if (!provider.getUser().getIsActive()) {
            throw new BadRequestException("This provider is currently unavailable.");
        }

        LocalDate date = LocalDate.parse(request.getPreferredDate());
        LocalTime time = LocalTime.parse(request.getPreferredTime());

        if (date.isBefore(LocalDate.now())) {
            throw new BadRequestException("Selected date has already passed.");
        }

        // Check for slot conflict
        List<Booking> conflicts = bookingRepository
                .findByProviderIdAndPreferredDateAndPreferredTimeAndStatusNot(
                        provider.getId(), date, time, BookingStatus.DECLINED);
        if (!conflicts.isEmpty()) {
            throw new BadRequestException("Provider is unavailable at this time — please choose another slot.");
        }

        Booking booking = Booking.builder()
                .client(client)
                .provider(provider)
                .preferredDate(date)
                .preferredTime(time)
                .jobDescription(request.getJobDescription())
                .status(BookingStatus.PENDING)
                .build();

        booking = bookingRepository.save(booking);

        // Create notification for provider
        Notification notification = Notification.builder()
                .recipient(provider.getUser())
                .title("New Booking Request")
                .message(client.getFullName() + " has requested a booking for " + date)
                .type("BOOKING_NEW")
                .referenceId(booking.getId())
                .build();
        notificationRepository.save(notification);

        return BookingResponse.from(booking);
    }

    @Transactional
    public BookingResponse actionBooking(Long providerId, Long bookingId, BookingActionRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found."));

        if (!booking.getProvider().getUser().getId().equals(providerId)) {
            throw new UnauthorizedException("You are not authorized to action this booking.");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException(
                    "This booking has already been " + booking.getStatus().name().toLowerCase() + ".");
        }

        String action = request.getAction();
        if ("accept".equals(action)) {
            booking.setStatus(BookingStatus.ACCEPTED);

            Notification notification = Notification.builder()
                    .recipient(booking.getClient())
                    .title("Booking Accepted!")
                    .message(booking.getProvider().getUser().getFullName() + " accepted your booking for "
                            + booking.getPreferredDate())
                    .type("BOOKING_ACCEPTED")
                    .referenceId(booking.getId())
                    .build();
            notificationRepository.save(notification);

        } else if ("decline".equals(action)) {
            if (request.getDeclineReason() == null || request.getDeclineReason().isBlank()) {
                throw new BadRequestException("Please provide a reason when declining a booking.");
            }
            booking.setStatus(BookingStatus.DECLINED);
            booking.setDeclineReason(request.getDeclineReason());

            Notification notification = Notification.builder()
                    .recipient(booking.getClient())
                    .title("Booking Declined")
                    .message(booking.getProvider().getUser().getFullName() + " declined your booking. Reason: "
                            + request.getDeclineReason())
                    .type("BOOKING_DECLINED")
                    .referenceId(booking.getId())
                    .build();
            notificationRepository.save(notification);
        }

        booking = bookingRepository.save(booking);
        return BookingResponse.from(booking);
    }

    @Transactional
    public BookingResponse completeBooking(Long clientId, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found."));

        if (!booking.getClient().getId().equals(clientId)) {
            throw new UnauthorizedException("You are not authorized to complete this booking.");
        }

        if (booking.getStatus() != BookingStatus.PAID) {
            throw new BadRequestException("Only paid bookings can be marked as completed.");
        }

        booking.setStatus(BookingStatus.COMPLETED);
        booking = bookingRepository.save(booking);

        Notification notification = Notification.builder()
                .recipient(booking.getProvider().getUser())
                .title("Booking Completed")
                .message(booking.getClient().getFullName() + " has marked the booking as completed.")
                .type("BOOKING_COMPLETED")
                .referenceId(booking.getId())
                .build();
        notificationRepository.save(notification);

        return BookingResponse.from(booking);
    }

    public Page<BookingResponse> getClientBookings(Long clientId, Pageable pageable) {
        return bookingRepository.findByClientIdOrderByCreatedAtDesc(clientId, pageable)
                .map(BookingResponse::from);
    }

    public Page<BookingResponse> getProviderBookings(Long providerId, BookingStatus status, Pageable pageable) {
        ProviderProfile provider = providerProfileRepository.findByUserId(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found."));

        if (status != null) {
            return bookingRepository.findByProviderIdAndStatusOrderByCreatedAtDesc(provider.getId(), status, pageable)
                    .map(BookingResponse::from);
        }
        return bookingRepository.findByProviderIdOrderByCreatedAtDesc(provider.getId(), pageable)
                .map(BookingResponse::from);
    }
}
