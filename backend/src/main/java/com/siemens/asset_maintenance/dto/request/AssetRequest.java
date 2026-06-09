package com.siemens.asset_maintenance.dto.request;

import com.siemens.asset_maintenance.entity.enums.AssetStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AssetRequest {

    @NotBlank(message = "Asset code is required")
    private String assetCode;

    @NotBlank(message = "Asset name is required")
    private String name;

    private String location;

    private AssetStatus status;
}