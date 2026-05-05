package com.ecommerce.authservice.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @Size(min = 2, max = 80, message = "First name must be 2-80 characters")
    private String firstName;

    @Size(min = 2, max = 80, message = "Last name must be 2-80 characters")
    private String lastName;

    private String phone;

    @Size(min = 6, max = 100, message = "Password must be at least 6 characters")
    private String newPassword;
}
