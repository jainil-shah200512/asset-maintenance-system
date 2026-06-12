package com.siemens.asset_maintenance.service;

import com.siemens.asset_maintenance.entity.Role;
import com.siemens.asset_maintenance.entity.User;
import com.siemens.asset_maintenance.entity.enums.RoleName;
import com.siemens.asset_maintenance.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    private CustomUserDetailsService customUserDetailsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        customUserDetailsService = new CustomUserDetailsService(userRepository);
    }

    @Test
    void loadUserByUsername_shouldReturnUserDetails() {
        Role managerRole = new Role();
        managerRole.setRoleName(RoleName.MANAGER);

        User manager = new User();
        manager.setEmail("manager@siemens.com");
        manager.setPasswordHash("encoded-password");
        manager.setRole(managerRole);
        manager.setIsActive(true);

        when(userRepository.findByEmail("manager@siemens.com"))
                .thenReturn(Optional.of(manager));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername("manager@siemens.com");

        assertNotNull(userDetails);
        assertEquals("manager@siemens.com", userDetails.getUsername());
        assertEquals("encoded-password", userDetails.getPassword());
        assertTrue(
                userDetails.getAuthorities().stream()
                        .anyMatch(auth -> auth.getAuthority().equals("ROLE_MANAGER"))
        );
    }

    @Test
    void loadUserByUsername_shouldThrow_whenUserMissing() {
        when(userRepository.findByEmail("missing@siemens.com"))
                .thenReturn(Optional.empty());

        assertThrows(
                UsernameNotFoundException.class,
                () -> customUserDetailsService.loadUserByUsername("missing@siemens.com")
        );
    }
}