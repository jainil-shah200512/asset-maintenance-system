package com.siemens.asset_maintenance.service;

import com.siemens.asset_maintenance.dto.response.ManagerDashboardResponse;
import com.siemens.asset_maintenance.dto.response.TechnicianDashboardResponse;
import com.siemens.asset_maintenance.dto.response.UserDashboardResponse;
import com.siemens.asset_maintenance.entity.User;
import com.siemens.asset_maintenance.entity.enums.RoleName;
import com.siemens.asset_maintenance.entity.enums.TaskStatus;
import com.siemens.asset_maintenance.repository.TaskRepository;
import com.siemens.asset_maintenance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public ManagerDashboardResponse getManagerDashboard() {
        User currentUser = getCurrentUser();

        if (currentUser.getRole().getRoleName() != RoleName.MANAGER) {
            throw new AccessDeniedException("Only MANAGER can access manager dashboard");
        }

        long reported = taskRepository.countByStatus(TaskStatus.REPORTED);
        long underReview = taskRepository.countByStatus(TaskStatus.UNDER_REVIEW);
        long assigned = taskRepository.countByStatus(TaskStatus.ASSIGNED);
        long inProgress = taskRepository.countByStatus(TaskStatus.IN_PROGRESS);
        long pendingMaterialApproval = taskRepository.countByStatus(TaskStatus.PENDING_MATERIAL_APPROVAL);
        long materialApproved = taskRepository.countByStatus(TaskStatus.MATERIAL_APPROVED);
        long materialRejected = taskRepository.countByStatus(TaskStatus.MATERIAL_REJECTED);
        long completed = taskRepository.countByStatus(TaskStatus.COMPLETED);
        long confirmed = taskRepository.countByStatus(TaskStatus.CONFIRMED);
        long closed = taskRepository.countByStatus(TaskStatus.CLOSED);

        long totalTasks =
                reported + underReview + assigned + inProgress +
                        pendingMaterialApproval + materialApproved + materialRejected +
                        completed + confirmed + closed;

        return new ManagerDashboardResponse(
                reported,
                underReview,
                assigned,
                inProgress,
                pendingMaterialApproval,
                materialApproved,
                materialRejected,
                completed,
                confirmed,
                closed,
                totalTasks
        );
    }

    public TechnicianDashboardResponse getTechnicianDashboard() {
        User currentUser = getCurrentUser();

        if (currentUser.getRole().getRoleName() != RoleName.TECHNICIAN) {
            throw new AccessDeniedException("Only TECHNICIAN can access technician dashboard");
        }

        long assigned = taskRepository.countByAssignedToAndStatus(currentUser, TaskStatus.ASSIGNED);
        long inProgress = taskRepository.countByAssignedToAndStatus(currentUser, TaskStatus.IN_PROGRESS);
        long pendingMaterialApproval = taskRepository.countByAssignedToAndStatus(currentUser, TaskStatus.PENDING_MATERIAL_APPROVAL);
        long materialApproved = taskRepository.countByAssignedToAndStatus(currentUser, TaskStatus.MATERIAL_APPROVED);
        long completed = taskRepository.countByAssignedToAndStatus(currentUser, TaskStatus.COMPLETED);
        long confirmed = taskRepository.countByAssignedToAndStatus(currentUser, TaskStatus.CONFIRMED);

        long totalAssignedTasks =
                assigned + inProgress + pendingMaterialApproval +
                        materialApproved + completed + confirmed;

        return new TechnicianDashboardResponse(
                assigned,
                inProgress,
                pendingMaterialApproval,
                materialApproved,
                completed,
                confirmed,
                totalAssignedTasks
        );
    }

    public UserDashboardResponse getUserDashboard() {
        User currentUser = getCurrentUser();

        if (currentUser.getRole().getRoleName() != RoleName.USER) {
            throw new AccessDeniedException("Only USER can access user dashboard");
        }

        long totalReportedTasks = taskRepository.countByReportedBy(currentUser);

        return new UserDashboardResponse(totalReportedTasks);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("No authenticated user found");
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Current user not found in database: " + email));
    }
}
