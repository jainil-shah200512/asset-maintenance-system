package com.siemens.asset_maintenance.controller;

import com.siemens.asset_maintenance.dto.response.ManagerDashboardResponse;
import com.siemens.asset_maintenance.dto.response.TechnicianDashboardResponse;
import com.siemens.asset_maintenance.dto.response.UserDashboardResponse;
import com.siemens.asset_maintenance.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/manager")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ManagerDashboardResponse> getManagerDashboard() {
        return ResponseEntity.ok(dashboardService.getManagerDashboard());
    }

    @GetMapping("/technician")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<TechnicianDashboardResponse> getTechnicianDashboard() {
        return ResponseEntity.ok(dashboardService.getTechnicianDashboard());
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UserDashboardResponse> getUserDashboard() {
        return ResponseEntity.ok(dashboardService.getUserDashboard());
    }
}