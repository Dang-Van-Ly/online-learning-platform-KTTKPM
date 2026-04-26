package com.onlinelearning.backend.user.entity;

import java.io.Serializable;
import com.onlinelearning.backend.membership.entity.User_membership;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.List;

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
    private String password;
    private String phone;
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    private String avatar;
    private String bio;

    private LocalDateTime createdAt = LocalDateTime.now();
    private Boolean status = true;

    // ❌ KHÔNG cho Redis serialize cái này
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @ToString.Exclude

    @JsonIgnore
    private List<User_membership> memberships;
}