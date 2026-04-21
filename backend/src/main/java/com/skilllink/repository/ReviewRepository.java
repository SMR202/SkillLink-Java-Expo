package com.skilllink.repository;

import com.skilllink.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByBookingId(Long bookingId);

    boolean existsByBookingIdAndClientId(Long bookingId, Long clientId);

    Page<Review> findByProviderIdOrderByCreatedAtDesc(Long providerId, Pageable pageable);

    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Review r WHERE r.provider.id = :providerId")
    Double calculateAvgRatingByProviderId(@Param("providerId") Long providerId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.provider.id = :providerId")
    Integer countByProviderId(@Param("providerId") Long providerId);
}
