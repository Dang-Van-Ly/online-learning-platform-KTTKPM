package com.onlinelearning.backend.auth;

import com.onlinelearning.backend.auth.dto.LoginRequest;
import com.onlinelearning.backend.config.JwtUtil;
import com.onlinelearning.backend.user.entity.Role;
import com.onlinelearning.backend.user.entity.User;
import com.onlinelearning.backend.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository,
                          JwtUtil jwtUtil,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    // ================= LOGIN =================
  
@PostMapping("/login")
public AuthResponse login(@RequestBody LoginRequest request){
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }

        String token = jwtUtil.generateToken(user);

        return new AuthResponse(token, user.getUsername(), user.getRole());
    }

    // ================= REGISTER =================
    @PostMapping("/register")
    public String register(@RequestBody User request) {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return "Username already exists";
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // ✅ DEFAULT ROLE
        user.setRole(Role.USER);

        userRepository.save(user);

        return "Register success";
    }
}