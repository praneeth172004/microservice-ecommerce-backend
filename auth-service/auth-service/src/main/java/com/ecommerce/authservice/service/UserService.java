package com.ecommerce.authservice.service;

import com.ecommerce.authservice.dto.ChangeRoleRequest;
import com.ecommerce.authservice.dto.UpdateProfileRequest;
import com.ecommerce.authservice.dto.UserResponse;
import com.ecommerce.authservice.entity.User;
import com.ecommerce.authservice.exception.AuthException;
import com.ecommerce.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthService authService;

    // ========== Get Current User ==========

    public UserResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthException("User not found"));
        return authService.mapToUserResponse(user);
    }

    // ========== Update Profile ==========

    @Transactional
    public UserResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthException("User not found"));

        if (request.getFirstName() != null && !request.getFirstName().isBlank()) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null && !request.getLastName().isBlank()) {
            user.setLastName(request.getLastName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            log.info("Password updated for user: {}", email);
        }

        User saved = userRepository.save(user);
        return authService.mapToUserResponse(saved);
    }

    // ========== Admin: List All Users ==========

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(authService::mapToUserResponse)
                .collect(Collectors.toList());
    }

    // ========== Admin: Get User By ID ==========

    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AuthException("User not found with id: " + id));
        return authService.mapToUserResponse(user);
    }

    // ========== Admin: Change Role ==========

    @Transactional
    public UserResponse changeRole(UUID userId, ChangeRoleRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("User not found with id: " + userId));
        user.setRole(request.getRole());
        User saved = userRepository.save(user);
        log.info("Role changed to {} for user: {}", request.getRole(), saved.getEmail());
        return authService.mapToUserResponse(saved);
    }

    // ========== Admin: Toggle Active Status ==========

    @Transactional
    public UserResponse toggleUserStatus(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("User not found with id: " + userId));
        user.setActive(!user.isActive());
        User saved = userRepository.save(user);
        log.info("User {} status set to active={}", saved.getEmail(), saved.isActive());
        return authService.mapToUserResponse(saved);
    }
}
