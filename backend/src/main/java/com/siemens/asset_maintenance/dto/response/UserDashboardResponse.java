package com.siemens.asset_maintenance.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDashboardResponse {
    private long totalReportedTasks;
}