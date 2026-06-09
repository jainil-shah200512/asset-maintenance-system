package com.siemens.asset_maintenance.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    // Generate signing key from secret
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Generate JWT token
    public String generateToken(UserDetails userDetails, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);

        return Jwts.builder()
                .claims(claims)                                          // ← Changed from setClaims()
                .subject(userDetails.getUsername())                      // ← Changed from setSubject()
                .issuedAt(new Date())                                    // ← Changed from setIssuedAt()
                .expiration(new Date(System.currentTimeMillis() + expiration)) // ← Changed from setExpiration()
                .signWith(getSigningKey())                               // ← Removed SignatureAlgorithm (auto-detected)
                .compact();
    }

    // Extract username (email) from token
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    // Extract role from token
    public String extractRole(String token) {
        return (String) extractAllClaims(token).get("role");
    }

    // Validate token
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    // Check if token is expired
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    // Extract all claims
    private Claims extractAllClaims(String token) {
        return Jwts.parser()                                             // ← Changed from parserBuilder()
                .verifyWith(getSigningKey())                             // ← Changed from setSigningKey()
                .build()
                .parseSignedClaims(token)                               // ← Changed from parseClaimsJws()
                .getPayload();                                           // ← Changed from getBody()
    }
}