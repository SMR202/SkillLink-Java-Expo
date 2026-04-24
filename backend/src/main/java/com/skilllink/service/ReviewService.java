package com.skilllink.service;

import com.skilllink.dto.request.ReviewRequest;
import com.skilllink.dto.response.ReviewResponse;
import com.skilllink.entity.*;
import com.skilllink.exception.*;
import com.skilllink.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ProviderProfileRepository providerProfileRepository;

    @Transactional
    public ReviewResponse submitReview(Long userId, ReviewRequest request) {
        // Find booking
        Booking booking = bookingRepository.findById(request.getBookingId())
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Verify booking is COMPLETED
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new ForbiddenException("Reviews can only be submitted for completed bookings");
        }

        // Verify user is the client of this booking
        if (!booking.getClient().getId().equals(userId)) {
            throw new ForbiddenException("You can only review your own bookings");
        }

        // Check for duplicate review
        if (reviewRepository.existsByBookingIdAndClientId(request.getBookingId(), userId)) {
            throw new DuplicateReviewException("You have already reviewed this booking");
        }

        User client = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ProviderProfile provider = booking.getProvider();

        // Create review
        Review review = Review.builder()
            .booking(booking)
            .client(client)
            .provider(provider)
            .rating(request.getRating())
            .comment(request.getReviewText())
            .build();
        review = reviewRepository.save(review);

        // Recalculate provider's average rating
        Double avgRating = reviewRepository.calculateAvgRatingByProviderId(provider.getId());
        Integer totalReviews = reviewRepository.countByProviderId(provider.getId());
        provider.setAvgRating(avgRating);
        provider.setTotalReviews(totalReviews);
        providerProfileRepository.save(provider);

        return mapToResponse(review);
    }

    public Page<ReviewResponse> getProviderReviews(Long providerId, Pageable pageable) {
        return reviewRepository.findByProviderIdOrderByCreatedAtDesc(providerId, pageable)
            .map(this::mapToResponse);
    }

    public Page<ReviewResponse> getReviewsForProviderUser(Long userId, Pageable pageable) {
        ProviderProfile provider = providerProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found"));
        return getProviderReviews(provider.getId(), pageable);
    }

    @Transactional
    public ReviewResponse respondToReview(Long userId, Long reviewId, String response) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        // Verify user is the provider
        if (!review.getProvider().getUser().getId().equals(userId)) {
            throw new ForbiddenException("Only the reviewed provider can respond");
        }

        review.setProviderResponse(response);
        review.setRespondedAt(java.time.LocalDateTime.now());
        review = reviewRepository.save(review);

        return mapToResponse(review);
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
            .id(review.getId())
            .bookingId(review.getBooking().getId())
            .clientId(review.getClient().getId())
            .clientName(review.getClient().getFullName())
            .providerId(review.getProvider().getId())
            .providerName(review.getProvider().getUser().getFullName())
            .rating(review.getRating())
            .comment(review.getComment())
            .providerResponse(review.getProviderResponse())
            .createdAt(review.getCreatedAt())
            .respondedAt(review.getRespondedAt())
            .build();
    }
}
