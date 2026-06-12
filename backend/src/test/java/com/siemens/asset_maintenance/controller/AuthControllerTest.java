package com.siemens.asset_maintenance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.siemens.asset_maintenance.dto.request.LoginRequest;
import com.siemens.asset_maintenance.dto.request.RegisterRequest;
import com.siemens.asset_maintenance.dto.response.RegisterResponse;
import com.siemens.asset_maintenance.entity.Role;
import com.siemens.asset_maintenance.entity.enums.RoleName;
import com.siemens.asset_maintenance.repository.UserRepository;
import com.siemens.asset_maintenance.security.JwtUtil;
import com.siemens.asset_maintenance.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserDetailsService userDetailsService;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthService authService;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
    }

    @Test
    void login_shouldReturnJwtResponse() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("manager@siemens.com");
        request.setPassword("password123");

        Role role = new Role();
        role.setRoleName(RoleName.MANAGER);

        com.siemens.asset_maintenance.entity.User appUser =
                new com.siemens.asset_maintenance.entity.User();
        appUser.setFirstName("Manager");
        appUser.setLastName("User");
        appUser.setEmail("manager@siemens.com");
        appUser.setRole(role);

        when(userDetailsService.loadUserByUsername("manager@siemens.com"))
                .thenReturn(userDetails);

        when(userRepository.findByEmail("manager@siemens.com"))
                .thenReturn(Optional.of(appUser));

        when(jwtUtil.generateToken(userDetails, "MANAGER"))
                .thenReturn("fake-jwt-token");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt-token"))
                .andExpect(jsonPath("$.email").value("manager@siemens.com"))
                .andExpect(jsonPath("$.role").value("MANAGER"))
                .andExpect(jsonPath("$.fullName").value("Manager User"));

        verify(authenticationManager, times(1)).authenticate(any());
        verify(userDetailsService, times(1)).loadUserByUsername("manager@siemens.com");
        verify(userRepository, times(1)).findByEmail("manager@siemens.com");
        verify(jwtUtil, times(1)).generateToken(userDetails, "MANAGER");
    }

    @Test
    void register_shouldReturnOk() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("Test");
        request.setLastName("User");
        request.setEmail("test@example.com");
        request.setPassword("password123");

        RegisterResponse response = new RegisterResponse(
                1L,
                "Test",
                "User",
                "test@example.com",
                "USER"
        );

        when(authService.registerUser(any(RegisterRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        verify(authService, times(1)).registerUser(any(RegisterRequest.class));
    }
}
