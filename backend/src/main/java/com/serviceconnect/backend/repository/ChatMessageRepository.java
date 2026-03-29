package com.serviceconnect.backend.repository;

import com.serviceconnect.backend.models.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByBookingIdOrderByTimestampAsc(Long bookingId);
}
