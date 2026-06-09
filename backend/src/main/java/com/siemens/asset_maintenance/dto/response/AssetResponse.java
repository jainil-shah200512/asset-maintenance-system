package com.siemens.asset_maintenance.dto.response;

import com.siemens.asset_maintenance.entity.enums.AssetStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AssetResponse {
    private Long id;
    private String assetCode;
    private String name;
    private String location;
    private AssetStatus status;
    private LocalDateTime createdAt;
}