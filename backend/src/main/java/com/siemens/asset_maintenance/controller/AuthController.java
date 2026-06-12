package com.siemens.asset_maintenance.controller;

import com.siemens.asset_maintenance.dto.request.LoginRequest;
import com.siemens.asset_maintenance.dto.response.JwtResponse;
import com.siemens.asset_maintenance.entity.User;
import com.siemens.asset_maintenance.repository.UserRepository;
import com.siemens.asset_maintenance.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import com.siemens.asset_maintenance.dto.request.RegisterRequest;
import com.siemens.asset_maintenance.dto.response.RegisterResponse;
import com.siemens.asset_maintenance.service.AuthService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest request) {



        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

        } catch (Exception e) {
            // RC: Debug statement left in code — replace with a proper logger (e.g. log.warn(...))
            System.out.println("❌ Auth failed: " + e.getClass().getName() + " → " + e.getMessage());
            throw e;
        }


        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());


        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();


        String role = user.getRole().getRoleName().name();


        String token = jwtUtil.generateToken(userDetails, role);


        return ResponseEntity.ok(new JwtResponse(
                token,
                user.getEmail(),
                role,
                user.getFirstName() + " " + user.getLastName()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.registerUser(request));
    }

}