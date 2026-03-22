package com.onlinelearning.backend.membership.controller;

import com.onlinelearning.backend.membership.entity.User_membership;
import com.onlinelearning.backend.membership.service.User_membershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-membership")
public class User_membershipController {
    @Autowired
    private User_membershipService userMembershipService;

    @PostMapping("/buy")
    public User_membership buy(@RequestParam Long userId, @RequestParam Long membershipId) {
        return userMembershipService.buyMembership(userId, membershipId);
    }
}