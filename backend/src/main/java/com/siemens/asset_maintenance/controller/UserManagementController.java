package com.siemens.asset_maintenance.controller;

import com.siemens.asset_maintenance.dto.request.CreateManagerRequest;
import com.siemens.asset_maintenance.dto.request.CreateTechnicianRequest;
import com.siemens.asset_maintenance.dto.response.SimpleUserResponse;
import com.siemens.asset_maintenance.service.UserManagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserManagementController {

    private final UserManagementService userManagementService;

    // MANAGER-only → list technicians
    @GetMapping("/api/users/technicians")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<SimpleUserResponse>> getTechnicians() {
        return ResponseEntity.ok(userManagementService.getAllTechnicians());
    }

    // MANAGER-only → list regular users
    @GetMapping("/api/users/regular-users")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<SimpleUserResponse>> getRegularUsers() {
        return ResponseEntity.ok(userManagementService.getAllRegularUsers());
    }

    // MANAGER-only → create technician
    @PostMapping("/api/users/technicians")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<SimpleUserResponse> createTechnician(
            @Valid @RequestBody CreateTechnicianRequest request
    ) {
        return ResponseEntity.ok(userManagementService.createTechnician(request));
    }

    // MANAGER-only → promote USER to TECHNICIAN
    @PutMapping("/api/users/{id}/promote-to-technician")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<SimpleUserResponse> promoteUserToTechnician(@PathVariable Long id) {
        return ResponseEntity.ok(userManagementService.promoteUserToTechnician(id));
    }

    // ADMIN-only → create manager
    @PostMapping("/api/admin/managers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SimpleUserResponse> createManager(
            @Valid @RequestBody CreateManagerRequest request
    ) {
        return ResponseEntity.ok(userManagementService.createManager(request));
    }
}