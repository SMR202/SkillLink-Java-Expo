package com.skilllink.repository;

import com.skilllink.entity.Booking;
import com.skilllink.entity.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Page<Booking> findByClientIdOrderByCreatedAtDesc(Long clientId, Pageable pageable);
    Page<Booking> findByProviderIdOrderByCreatedAtDesc(Long providerId, Pageable pageable);
    Page<Booking> findByProviderIdAndStatusOrderByCreatedAtDesc(Long providerId, BookingStatus status, Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.client.id = :userId OR b.provider.user.id = :userId ORDER BY b.updatedAt DESC")
    List<Booking> findConversationsForUser(@Param("userId") Long userId);

    List<Booking> findByProviderIdAndPreferredDateAndPreferredTimeAndStatusNot(
        Long providerId, LocalDate date, LocalTime time, BookingStatus excludeStatus
    );
    boolean existsByClientIdAndProviderIdAndStatus(Long clientId, Long providerId, BookingStatus status);

    // Sprint 3: Admin analytics
    long countByStatus(BookingStatus status);
}
