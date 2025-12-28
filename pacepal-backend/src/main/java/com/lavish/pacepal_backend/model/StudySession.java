package com.lavish.pacepal_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "study_sessions")
@Data
public class StudySession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long durationMinutes;
    private String topic;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}