package com.siemens.asset_maintenance.service;

import com.siemens.asset_maintenance.dto.request.AssignTaskRequest;
import com.siemens.asset_maintenance.dto.request.TaskActionRequest;
import com.siemens.asset_maintenance.entity.Role;
import com.siemens.asset_maintenance.entity.Task;
import com.siemens.asset_maintenance.entity.User;
import com.siemens.asset_maintenance.entity.enums.RoleName;
import com.siemens.asset_maintenance.entity.enums.TaskStatus;
import com.siemens.asset_maintenance.repository.ActivityLogRepository;
import com.siemens.asset_maintenance.repository.AssetRepository;
import com.siemens.asset_maintenance.repository.TaskRepository;
import com.siemens.asset_maintenance.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AssetRepository assetRepository;

    @Mock
    private ActivityLogRepository activityLogRepository;

    @InjectMocks
    private TaskService taskService;

    private User manager;
    private User technician;
    private Task task;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        Role managerRole = new Role();
        managerRole.setRoleName(RoleName.MANAGER);

        Role technicianRole = new Role();
        technicianRole.setRoleName(RoleName.TECHNICIAN);

        manager = new User();
        manager.setId(1L);
        manager.setEmail("manager@siemens.com");
        manager.setFirstName("Manager");
        manager.setLastName("User");
        manager.setRole(managerRole);
        manager.setIsActive(true);

        technician = new User();
        technician.setId(2L);
        technician.setEmail("technician@siemens.com");
        technician.setFirstName("Tech");
        technician.setLastName("User");
        technician.setRole(technicianRole);
        technician.setIsActive(true);

        task = new Task();
        task.setId(10L);
        task.setTaskCode("TSK-1001-ABC");
        task.setTitle("Motor Issue");
        task.setDescription("Motor is not rotating");
        task.setStatus(TaskStatus.REPORTED);
        task.setCreatedAt(LocalDateTime.now());

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("manager@siemens.com", null)
        );
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void assignTask_shouldAssignSuccessfully() {
        AssignTaskRequest request = new AssignTaskRequest();
        request.setTechnicianId(2L);
        request.setRemarks("Please handle this task.");

        when(userRepository.findByEmail("manager@siemens.com")).thenReturn(Optional.of(manager));
        when(taskRepository.findById(10L)).thenReturn(Optional.of(task));
        when(userRepository.findById(2L)).thenReturn(Optional.of(technician));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = taskService.assignTask(10L, request);

        assertNotNull(response);
        assertEquals(TaskStatus.ASSIGNED, response.getStatus());
        assertEquals("technician@siemens.com", response.getAssignedToEmail());

        verify(taskRepository, times(1)).save(task);
        verify(activityLogRepository, times(1)).save(any());
    }

    @Test
    void assignTask_shouldFail_whenAlreadyAssigned() {
        task.setAssignedTo(technician);

        AssignTaskRequest request = new AssignTaskRequest();
        request.setTechnicianId(2L);

        when(userRepository.findByEmail("manager@siemens.com")).thenReturn(Optional.of(manager));
        when(taskRepository.findById(10L)).thenReturn(Optional.of(task));

        assertThrows(ResponseStatusException.class, () -> taskService.assignTask(10L, request));
    }

    @Test
    void rejectTask_shouldFail_whenRemarksAreMissing() {
        task.setStatus(TaskStatus.COMPLETED);

        TaskActionRequest request = new TaskActionRequest();
        request.setRemarks("");

        when(userRepository.findByEmail("manager@siemens.com")).thenReturn(Optional.of(manager));
        when(taskRepository.findById(10L)).thenReturn(Optional.of(task));

        assertThrows(ResponseStatusException.class, () -> taskService.rejectTask(10L, request));
    }
}