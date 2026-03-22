package com.onlinelearning.backend.user.entity;


import com.onlinelearning.backend.membership.entity.User_membership;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Sử dụng tính năng tự tăng của DB
    private Long id;
    private String username;
    private String password;
    private String phone;
    private String email;
    private String role;
    private String avatar;
    private String bio;

    private LocalDateTime createdAt;
    private Boolean status;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<User_membership> memberships;
}
