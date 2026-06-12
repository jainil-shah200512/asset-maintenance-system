package com.siemens.asset_maintenance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.siemens.asset_maintenance.dto.request.AssignTaskRequest;
import com.siemens.asset_maintenance.dto.request.TaskActionRequest;
import com.siemens.asset_maintenance.entity.enums.TaskPriority;
import com.siemens.asset_maintenance.entity.enums.TaskStatus;
import com.siemens.asset_maintenance.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class TaskControllerTest {

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private TaskService taskService;

    @InjectMocks
    private TaskController taskController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(taskController).build();
    }

    @Test
    void getAllTasks_shouldReturnOk() throws Exception {
        when(taskService.getAllTasks(any(), any(), any()))
                .thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk());

        verify(taskService, times(1)).getAllTasks(any(), any(), any());
    }

    @Test
    void getTaskById_shouldReturnOk() throws Exception {
        when(taskService.getTaskById(anyLong())).thenReturn(null);

        mockMvc.perform(get("/api/tasks/1"))
                .andExpect(status().isOk());

        verify(taskService, times(1)).getTaskById(1L);
    }

    @Test
    void assignTask_shouldReturnOk() throws Exception {
        AssignTaskRequest request = new AssignTaskRequest();
        request.setTechnicianId(2L);
        request.setRemarks("Assigning task");

        when(taskService.assignTask(anyLong(), any(AssignTaskRequest.class))).thenReturn(null);

        mockMvc.perform(put("/api/tasks/1/assign")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        verify(taskService, times(1)).assignTask(anyLong(), any(AssignTaskRequest.class));
    }

    @Test
    void startTask_shouldReturnOk() throws Exception {
        TaskActionRequest request = new TaskActionRequest();
        request.setRemarks("Starting task");

        when(taskService.startTask(anyLong(), any(TaskActionRequest.class))).thenReturn(null);

        mockMvc.perform(put("/api/tasks/1/start")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        verify(taskService, times(1)).startTask(anyLong(), any(TaskActionRequest.class));
    }

    @Test
    void completeTask_shouldReturnOk() throws Exception {
        TaskActionRequest request = new TaskActionRequest();
        request.setRemarks("Completing task");

        when(taskService.completeTask(anyLong(), any(TaskActionRequest.class))).thenReturn(null);

        mockMvc.perform(put("/api/tasks/1/complete")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        verify(taskService, times(1)).completeTask(anyLong(), any(TaskActionRequest.class));
    }

    @Test
    void confirmTask_shouldReturnOk() throws Exception {
        TaskActionRequest request = new TaskActionRequest();
        request.setRemarks("Confirming task");

        when(taskService.confirmTask(anyLong(), any(TaskActionRequest.class))).thenReturn(null);

        mockMvc.perform(put("/api/tasks/1/confirm")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        verify(taskService, times(1)).confirmTask(anyLong(), any(TaskActionRequest.class));
    }

    @Test
    void closeTask_shouldReturnOk() throws Exception {
        TaskActionRequest request = new TaskActionRequest();
        request.setRemarks("Closing task");

        when(taskService.closeTask(anyLong(), any(TaskActionRequest.class))).thenReturn(null);

        mockMvc.perform(put("/api/tasks/1/close")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        verify(taskService, times(1)).closeTask(anyLong(), any(TaskActionRequest.class));
    }

    @Test
    void rejectTask_shouldReturnOk() throws Exception {
        TaskActionRequest request = new TaskActionRequest();
        request.setRemarks("Incomplete work");

        when(taskService.rejectTask(anyLong(), any(TaskActionRequest.class))).thenReturn(null);

        mockMvc.perform(put("/api/tasks/1/reject")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        verify(taskService, times(1)).rejectTask(anyLong(), any(TaskActionRequest.class));
    }

    @Test
    void getTaskActivityLogs_shouldReturnOk() throws Exception {
        when(taskService.getTaskActivityLogs(anyLong()))
                .thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/tasks/1/activity-logs"))
                .andExpect(status().isOk());

        verify(taskService, times(1)).getTaskActivityLogs(1L);
    }
}