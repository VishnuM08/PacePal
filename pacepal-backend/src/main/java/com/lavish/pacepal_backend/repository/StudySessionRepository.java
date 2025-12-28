package com.lavish.pacepal_backend.repository;

import com.lavish.pacepal_backend.model.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudySessionRepository extends JpaRepository<StudySession, Long> {
    // This will help us show the user their history later
    List<StudySession> findByUserUsername(String username);
}