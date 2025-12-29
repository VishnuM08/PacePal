package com.lavish.pacepal_backend.model;

import lombok.Data;

@Data
public class StatusMessage {

    private String username;
    private String status;   // STUDYING / BREAK / OFFLINE
}
