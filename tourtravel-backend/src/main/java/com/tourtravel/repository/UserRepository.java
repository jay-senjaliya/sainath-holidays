package com.tourtravel.repository;

import com.tourtravel.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

    Optional<User> findByOauthId(String oauthId);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    List<User> findByRoleAndActiveTrueOrderByNameAsc(User.Role role);
}
