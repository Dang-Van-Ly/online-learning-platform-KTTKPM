package com.onlinelearning.backend.membership.controller;

import com.onlinelearning.backend.membership.entity.Membership;
import com.onlinelearning.backend.membership.service.MembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/memberships")
public class MembershipController {
    @Autowired
    private MembershipService membershipService;

    @GetMapping
    public List<Membership> getAll() {
        return membershipService.getAllMemberships();
    }

    @PostMapping
    public Membership create(@RequestBody Membership membership) {
        return membershipService.createMembership(membership);
    }
}