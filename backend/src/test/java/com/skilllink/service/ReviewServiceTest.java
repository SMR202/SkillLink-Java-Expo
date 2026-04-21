package com.skilllink.service;

import com.skilllink.dto.request.ReviewRequest;
import com.skilllink.dto.response.ReviewResponse;
import com.skilllink.entity.*;
import com.skilllink.exception.DuplicateReviewException;
import com.skilllink.exception.ForbiddenException;
import com.skilllink.exception.ResourceNotFoundException;
import com.skilllink.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @InjectMocks private ReviewService reviewService;
    @Mock private ReviewRepository reviewRepository;
    @Mock private BookingRepository bookingRepository;
    @Mock private UserRepository userRepository;
    @Mock private ProviderProfileRepository providerProfileRepository;

    private User client;
    private User providerUser;
    private ProviderProfile provider;
    private Booking booking;

    @BeforeEach
    void setUp() {
        client = User.builder().id(1L).fullName("Test Client").email("client@test.com").role(Role.CLIENT).build();
        providerUser = User.builder().id(2L).fullName("Test Provider").email("provider@test.com").role(Role.PROVIDER).build();
        provider = ProviderProfile.builder().id(10L).user(providerUser).avgRating(0.0).totalReviews(0).build();
        booking = Booking.builder().id(100L).client(client).provider(provider).status(BookingStatus.COMPLETED).build();
    }

    @Test
    @DisplayName("Should throw when booking is not COMPLETED")
    void shouldThrow_whenBookingNotCompleted() {
        booking.setStatus(BookingStatus.PENDING);
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));

        ReviewRequest req = new ReviewRequest();
        req.setBookingId(100L);
        req.setRating(4);
        req.setReviewText("Good service overall experience");

        assertThrows(ForbiddenException.class, () ->
            reviewService.submitReview(1L, req));
    }

    @Test
    @DisplayName("Should throw when duplicate review exists")
    void shouldThrow_whenDuplicateReview() {
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));
        when(reviewRepository.existsByBookingIdAndClientId(100L, 1L)).thenReturn(true);

        ReviewRequest req = new ReviewRequest();
        req.setBookingId(100L);
        req.setRating(4);
        req.setReviewText("Good service overall experience");

        assertThrows(DuplicateReviewException.class, () ->
            reviewService.submitReview(1L, req));
    }

    @Test
    @DisplayName("Should save review when valid")
    void shouldSave_whenValid() {
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));
        when(reviewRepository.existsByBookingIdAndClientId(100L, 1L)).thenReturn(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(client));
        when(reviewRepository.save(any(Review.class))).thenAnswer(inv -> {
            Review r = inv.getArgument(0);
            r.setId(1L);
            return r;
        });
        when(reviewRepository.calculateAvgRatingByProviderId(10L)).thenReturn(4.0);
        when(reviewRepository.countByProviderId(10L)).thenReturn(1);
        when(providerProfileRepository.save(any())).thenReturn(provider);

        ReviewRequest req = new ReviewRequest();
        req.setBookingId(100L);
        req.setRating(4);
        req.setReviewText("Great experience with this provider");

        ReviewResponse res = reviewService.submitReview(1L, req);

        assertNotNull(res);
        assertEquals(4, res.getRating());
        verify(reviewRepository, times(1)).save(any(Review.class));
    }

    @Test
    @DisplayName("Should update provider avgRating after review")
    void shouldUpdateAvgRating_afterReview() {
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));
        when(reviewRepository.existsByBookingIdAndClientId(100L, 1L)).thenReturn(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(client));
        when(reviewRepository.save(any(Review.class))).thenAnswer(inv -> {
            Review r = inv.getArgument(0);
            r.setId(1L);
            return r;
        });
        when(reviewRepository.calculateAvgRatingByProviderId(10L)).thenReturn(4.5);
        when(reviewRepository.countByProviderId(10L)).thenReturn(2);
        when(providerProfileRepository.save(any())).thenReturn(provider);

        ReviewRequest req = new ReviewRequest();
        req.setBookingId(100L);
        req.setRating(5);
        req.setReviewText("Absolutely excellent service provider!");

        reviewService.submitReview(1L, req);

        verify(providerProfileRepository).save(argThat(p ->
            p.getAvgRating() == 4.5 && p.getTotalReviews() == 2
        ));
    }
}
