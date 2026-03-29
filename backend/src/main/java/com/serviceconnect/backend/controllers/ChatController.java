package com.serviceconnect.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.serviceconnect.backend.models.ChatMessage;
import com.serviceconnect.backend.repository.ChatMessageRepository;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @MessageMapping("/chat/{bookingId}")
    public void processMessage(@DestinationVariable String bookingId, @Payload ChatMessage chatMessage) {
        ChatMessage saved = chatMessageRepository.save(new ChatMessage(
            Long.parseLong(bookingId), 
            chatMessage.getSenderId(), 
            chatMessage.getSenderName(),
            chatMessage.getContent()
        ));
        messagingTemplate.convertAndSend("/topic/messages/" + bookingId, saved);
    }

    @GetMapping("/api/messages/{bookingId}")
    public ResponseEntity<List<ChatMessage>> findChatMessages(@PathVariable String bookingId) {
        return ResponseEntity.ok(chatMessageRepository.findByBookingIdOrderByTimestampAsc(Long.parseLong(bookingId)));
    }
}
