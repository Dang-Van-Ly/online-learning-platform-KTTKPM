package com.onlinelearning.backend.membership.controller;

import com.onlinelearning.backend.membership.dto.BuyMembershipRequest;
import com.onlinelearning.backend.membership.entity.User_membership;
import com.onlinelearning.backend.membership.service.User_membershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user-membership")
public class User_membershipController {
    @Autowired
    private User_membershipService userMembershipService;

    @PostMapping("/buy")
    public ResponseEntity<?> buyMembership(@RequestBody BuyMembershipRequest request) {
        try {
            User_membership result = userMembershipService.buyMembership(
                    request.getUserId(),
                    request.getMembershipId(),
                    request.getUserEmail(),
                    request.getUserName()
            );
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public List<User_membership> getUserMemberships(@PathVariable Long userId) {
        return userMembershipService.getUserMemberships(userId);
    }
}