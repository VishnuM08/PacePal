package com.lavish.pacepal_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.lavish.pacepal_backend.model.User;
import com.lavish.pacepal_backend.repository.UserRepository;
import com.lavish.pacepal_backend.security.JwtUtils;
import com.lavish.pacepal_backend.service.UserService;
import com.lavish.pacepal_backend.dto.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        userService.registerUser(user);

        return ResponseEntity.ok("User registered successfully!");
    }


    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        String jwt = jwtUtils.generateJwtToken(authentication.getName());
        return ResponseEntity.ok(new JwtResponse(jwt, authentication.getName()));
    }
    
    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetRequest resetRequest) {
        return userRepository.findByUsername(resetRequest.getUsername())
            .map(user -> {
                user.setPassword(passwordEncoder.encode(resetRequest.getNewPassword()));
                userRepository.save(user);
                return ResponseEntity.ok("Password updated successfully!");
            })
            .orElse(ResponseEntity.badRequest().body("Error: User not found!"));
    }
}