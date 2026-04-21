package com.skilllink.repository;

import com.skilllink.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByBookingId(Long bookingId);

    boolean existsByBookingId(Long bookingId);

    Page<Payment> findByProviderIdOrderByPaidAtDesc(Long providerId, Pageable pageable);

    Page<Payment> findByClientIdOrderByCreatedAtDesc(Long clientId, Pageable pageable);

    @Query("SELECT COALESCE(SUM(p.providerEarnings), 0) FROM Payment p WHERE p.provider.id = :providerId AND p.status = 'COMPLETED'")
    BigDecimal sumEarningsByProviderId(@Param("providerId") Long providerId);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.provider.id = :providerId AND p.status = 'COMPLETED'")
    Long countCompletedByProviderId(@Param("providerId") Long providerId);
}
