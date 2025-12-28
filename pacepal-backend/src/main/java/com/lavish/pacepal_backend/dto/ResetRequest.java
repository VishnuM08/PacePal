package com.lavish.pacepal_backend.dto;

import lombok.Data;

@Data
public class ResetRequest {
	private String username;
	private String newPassword;
}
