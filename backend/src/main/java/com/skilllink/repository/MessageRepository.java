package com.skilllink.repository;

import com.skilllink.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByBookingIdOrderBySentAtAsc(Long bookingId);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.booking.id = :bookingId AND m.sender.id <> :userId AND m.isRead = false")
    Long countUnreadByBookingIdAndNotSender(@Param("bookingId") Long bookingId, @Param("userId") Long userId);

    @Modifying
    @Query("UPDATE Message m SET m.isRead = true WHERE m.booking.id = :bookingId AND m.sender.id <> :userId AND m.isRead = false")
    void markAllAsReadForBooking(@Param("bookingId") Long bookingId, @Param("userId") Long userId);
}
