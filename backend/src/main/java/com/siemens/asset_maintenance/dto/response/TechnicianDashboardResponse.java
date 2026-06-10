package com.siemens.asset_maintenance.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TechnicianDashboardResponse {
    private long assigned;
    private long inProgress;
    private long pendingMaterialApproval;
    private long materialApproved;
    private long completed;
    private long reworkRequired;
    private long confirmed;
    private long totalAssignedTasks;
}
