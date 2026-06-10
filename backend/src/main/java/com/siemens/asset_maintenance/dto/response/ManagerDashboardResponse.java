package com.siemens.asset_maintenance.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ManagerDashboardResponse {
    private long reported;
    private long underReview;
    private long assigned;
    private long inProgress;
    private long pendingMaterialApproval;
    private long materialApproved;
    private long materialRejected;
    private long completed;
    private long confirmed;
    private long reworkRequired;
    private long closed;
    private long totalTasks;
}