package com.siemens.asset_maintenance.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SimpleUserResponse {
    private Long id;
    private String email;
    private String fullName;
    private String role;
}
