package com.onlinelearning.backend.user.repository;

import com.onlinelearning.backend.user.entity.Role;
import com.onlinelearning.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    List<User> findByRole(Role role);

    long countByRole(Role role);

    // Optional: pageable variant
    List<User> findByRole(Role role, Pageable pageable);
}
