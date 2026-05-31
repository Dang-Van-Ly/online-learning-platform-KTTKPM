package com.onlinelearning.backend.user.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    @JsonIgnore
    private String password;
    private String phone;
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    private String avatar;
    private String bio;

    private LocalDateTime createdAt = LocalDateTime.now();
    private Boolean status = true;
}
