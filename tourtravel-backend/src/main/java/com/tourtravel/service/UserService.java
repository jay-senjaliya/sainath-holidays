package com.tourtravel.service;

import com.tourtravel.dto.response.UserResponse;
import com.tourtravel.entity.User;
import com.tourtravel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Generic user-management read operations, distinct from AuthService (which owns
 * login/registration). Currently backs the CRM Lead assignment dropdown; expected
 * to grow (staff management, RBAC) in the Enterprise phase.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<UserResponse> getAssignableStaff() {
        return userRepository.findByRoleAndActiveTrueOrderByNameAsc(User.Role.ADMIN).stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
