package com.ecommerce.authservice.dto;

import com.ecommerce.authservice.entity.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChangeRoleRequest {
    @NotNull(message = "Role is required")
    private Role role;
}
