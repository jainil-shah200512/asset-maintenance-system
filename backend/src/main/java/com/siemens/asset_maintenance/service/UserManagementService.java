package com.siemens.asset_maintenance.service;

import com.siemens.asset_maintenance.dto.request.CreateManagerRequest;
import com.siemens.asset_maintenance.dto.request.CreateTechnicianRequest;
import com.siemens.asset_maintenance.dto.response.SimpleUserResponse;
import com.siemens.asset_maintenance.entity.Role;
import com.siemens.asset_maintenance.entity.User;
import com.siemens.asset_maintenance.entity.enums.RoleName;
import com.siemens.asset_maintenance.repository.RoleRepository;
import com.siemens.asset_maintenance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserManagementService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public List<SimpleUserResponse> getAllTechnicians() {
        return userRepository.findByRole_RoleName(RoleName.TECHNICIAN)
                .stream()
                .map(this::mapToSimpleUserResponse)
                .toList();
    }

    public List<SimpleUserResponse> getAllRegularUsers() {
        return userRepository.findByRole_RoleName(RoleName.USER)
                .stream()
                .map(this::mapToSimpleUserResponse)
                .toList();
    }

    public SimpleUserResponse createTechnician(CreateTechnicianRequest request) {
        User currentUser = getCurrentUser();

        if (currentUser.getRole().getRoleName() != RoleName.MANAGER) {
            throw new AccessDeniedException("Only MANAGER can create technicians");
        }

        if (userRepository.findByEmail(request.getEmail().trim().toLowerCase()).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "User already exists with email: " + request.getEmail()
            );
        }

        Role technicianRole = roleRepository.findByRoleName(RoleName.TECHNICIAN)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "TECHNICIAN role not found"
                ));

        User technician = new User();
        technician.setFirstName(request.getFirstName().trim());
        technician.setLastName(request.getLastName().trim());
        technician.setEmail(request.getEmail().trim().toLowerCase());
        technician.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        technician.setRole(technicianRole);
        technician.setIsActive(true);

        User saved = userRepository.save(technician);
        return mapToSimpleUserResponse(saved);
    }

    public SimpleUserResponse promoteUserToTechnician(Long userId) {
        User currentUser = getCurrentUser();

        if (currentUser.getRole().getRoleName() != RoleName.MANAGER) {
            throw new AccessDeniedException("Only MANAGER can promote users to technicians");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found with id: " + userId
                ));

        if (user.getRole().getRoleName() != RoleName.USER) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only USER accounts can be promoted to TECHNICIAN"
            );
        }

        Role technicianRole = roleRepository.findByRoleName(RoleName.TECHNICIAN)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "TECHNICIAN role not found"
                ));

        user.setRole(technicianRole);

        User updated = userRepository.save(user);
        return mapToSimpleUserResponse(updated);
    }

    public SimpleUserResponse createManager(CreateManagerRequest request) {
        User currentUser = getCurrentUser();

        if (currentUser.getRole().getRoleName() != RoleName.ADMIN) {
            throw new AccessDeniedException("Only ADMIN can create managers");
        }

        if (userRepository.findByEmail(request.getEmail().trim().toLowerCase()).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "User already exists with email: " + request.getEmail()
            );
        }

        Role managerRole = roleRepository.findByRoleName(RoleName.MANAGER)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "MANAGER role not found"
                ));

        User manager = new User();
        manager.setFirstName(request.getFirstName().trim());
        manager.setLastName(request.getLastName().trim());
        manager.setEmail(request.getEmail().trim().toLowerCase());
        manager.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        manager.setRole(managerRole);
        manager.setIsActive(true);

        User saved = userRepository.save(manager);
        return mapToSimpleUserResponse(saved);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authenticated user found");
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Current user not found in database: " + email
                ));
    }

    private SimpleUserResponse mapToSimpleUserResponse(User user) {
        return new SimpleUserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName() + " " + user.getLastName(),
                user.getRole().getRoleName().name()
        );
    }
}