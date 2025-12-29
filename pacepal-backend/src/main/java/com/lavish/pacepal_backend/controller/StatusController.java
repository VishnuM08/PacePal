package com.lavish.pacepal_backend.controller;

import com.lavish.pacepal_backend.model.StatusMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class StatusController {

    @MessageMapping("/status")      // frontend sends to /app/status
    @SendTo("/topic/status")        // broadcast to everyone subscribed
    public StatusMessage updateStatus(StatusMessage message) {
        return message;
    }
}
