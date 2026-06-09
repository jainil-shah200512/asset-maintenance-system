package com.siemens.asset_maintenance.controller;

import com.siemens.asset_maintenance.dto.request.AssetRequest;
import com.siemens.asset_maintenance.dto.response.AssetResponse;
import com.siemens.asset_maintenance.entity.enums.AssetStatus;
import com.siemens.asset_maintenance.service.AssetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;

    @PostMapping
    public ResponseEntity<AssetResponse> createAsset(@Valid @RequestBody AssetRequest request) {
        return ResponseEntity.ok(assetService.createAsset(request));
    }

    @GetMapping
    public ResponseEntity<List<AssetResponse>> getAllAssets() {
        return ResponseEntity.ok(assetService.getAllAssets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssetResponse> getAssetById(@PathVariable Long id) {
        return ResponseEntity.ok(assetService.getAssetById(id));
    }

    @GetMapping("/code/{assetCode}")
    public ResponseEntity<AssetResponse> getAssetByCode(@PathVariable String assetCode) {
        return ResponseEntity.ok(assetService.getAssetByCode(assetCode));
    }

    @GetMapping("/search")
    public ResponseEntity<List<AssetResponse>> searchAssets(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) AssetStatus status
    ) {
        return ResponseEntity.ok(assetService.searchAssets(keyword, status));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssetResponse> updateAsset(
            @PathVariable Long id,
            @Valid @RequestBody AssetRequest request
    ) {
        return ResponseEntity.ok(assetService.updateAsset(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAsset(@PathVariable Long id) {
        assetService.deleteAsset(id);
        return ResponseEntity.ok("Asset deleted successfully");
    }
}
