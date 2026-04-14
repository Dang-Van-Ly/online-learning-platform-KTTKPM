package com.onlinelearning.backend.user.entity;

import com.onlinelearning.backend.membership.entity.User_membership;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String phone;
    private String email;

    // ✅ FIX: dùng enum thay vì String
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    private String avatar;
    private String bio;

    private LocalDateTime createdAt = LocalDateTime.now();
    private Boolean status = true;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<User_membership> memberships;
}