package com.serviceconnect.backend.models;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long bookingId;
    private Long senderId;
    private String senderName;
    private String content;
    private LocalDateTime timestamp;

    public ChatMessage() {}

    public ChatMessage(Long bookingId, Long senderId, String senderName, String content) {
        this.bookingId = bookingId;
        this.senderId = senderId;
        this.senderName = senderName;
        this.content = content;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
