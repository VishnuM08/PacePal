package com.lavish.pacepal_backend.security;

import java.util.Date;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {
    // 1. Move this to application.properties and use @Value to inject it
    @Value("${pacepal.app.jwtSecret}")
    private String jwtSecret;

    @Value("${pacepal.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    // Helper to generate a secure Key object from your secret string
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateJwtToken(String username) {
        return Jwts.builder()
            .subject(username)
            .issuedAt(new Date())
            .expiration(new Date((new Date()).getTime() + jwtExpirationMs))
            .signWith(getSigningKey()) // Automatically picks correct algorithm based on key size
            .compact();
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey()) 
            .build()
            .parseSignedClaims(token) // Correct for 0.12.x
            .getPayload()             // getPayload() replaces getBody()
            .getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // Log specific errors like ExpiredJwtException, MalformedJwtException, etc.
            return false;
        }
    }
}