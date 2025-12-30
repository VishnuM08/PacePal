package com.lavish.pacepal_backend.controller;

import com.lavish.pacepal_backend.model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/chat")
    @SendTo("/topic/chat")
    public ChatMessage send(ChatMessage message) {
        return message;
    }
}
