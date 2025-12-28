package com.lavish.pacepal_backend.controller;

import com.lavish.pacepal_backend.model.StudySession;
import com.lavish.pacepal_backend.model.User;
import com.lavish.pacepal_backend.repository.StudySessionRepository;
import com.lavish.pacepal_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class StudySessionController {

    @Autowired
    private StudySessionRepository studySessionRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/save")
    public ResponseEntity<?> saveSession(@RequestBody StudySession session, Authentication authentication) {
        // Get the logged-in user from the JWT token
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        session.setUser(user);
        session.setEndTime(LocalDateTime.now()); // Set the finish time
        
        studySessionRepository.save(session);
        return ResponseEntity.ok("Session saved successfully!");
    }

    @GetMapping("/my-history")
    public List<StudySession> getUserHistory(Authentication authentication) {
        return studySessionRepository.findByUserUsername(authentication.getName());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSession(@PathVariable Long id, Authentication authentication) {
        return studySessionRepository.findById(id)
            .map(session -> {
                // Security check: Ensure the session belongs to the person trying to delete it
                if (!session.getUser().getUsername().equals(authentication.getName())) {
                    return ResponseEntity.status(403).body("Error: Unauthorized to delete this session");
                }
                studySessionRepository.delete(session);
                return ResponseEntity.ok("Session deleted successfully");
            })
            .orElse(ResponseEntity.notFound().build());
    }
}