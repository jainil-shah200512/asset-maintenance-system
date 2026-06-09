package com.siemens.asset_maintenance.controller;

import com.siemens.asset_maintenance.dto.request.ApproveMaterialRequestDto;
import com.siemens.asset_maintenance.dto.request.CreateMaterialRequestDto;
import com.siemens.asset_maintenance.dto.request.RejectMaterialRequestDto;
import com.siemens.asset_maintenance.dto.response.MaterialRequestResponse;
import com.siemens.asset_maintenance.service.MaterialRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/material-requests")
@RequiredArgsConstructor
public class MaterialRequestController {

    private final MaterialRequestService materialRequestService;

    @PostMapping
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<MaterialRequestResponse> createMaterialRequest(
            @Valid @RequestBody CreateMaterialRequestDto request
    ) {
        return ResponseEntity.ok(materialRequestService.createMaterialRequest(request));
    }

    @GetMapping("/task/{taskId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MaterialRequestResponse>> getRequestsForTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(materialRequestService.getRequestsForTask(taskId));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<MaterialRequestResponse> approveRequest(
            @PathVariable Long id,
            @Valid @RequestBody ApproveMaterialRequestDto request
    ) {
        return ResponseEntity.ok(materialRequestService.approveRequest(id, request));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<MaterialRequestResponse> rejectRequest(
            @PathVariable Long id,
            @Valid @RequestBody RejectMaterialRequestDto request
    ) {
        return ResponseEntity.ok(materialRequestService.rejectRequest(id, request));
    }
}