package com.onlinelearning.backend.membership.controller;

import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

@RestController
@RequestMapping("/api/user-membership")
public class User_membershipController {
    private static final Logger logger = LoggerFactory.getLogger(User_membershipController.class);
    @Autowired
    private User_membershipService userMembershipService;

    @PostMapping("/buy")
    public ResponseEntity<?> buyMembership(@RequestBody Map<String, Object> request) {
        try {
            logger.info("buyMembership called with payload: {}", request);
            // Parse userId tolerantly: accept Number or String
            Long userId = null;
            Object uidObj = request.get("userId");
            if (uidObj != null) {
                if (uidObj instanceof Number) {
                    userId = ((Number) uidObj).longValue();
                } else {
                    try {
                        userId = Long.parseLong(uidObj.toString());
                    } catch (NumberFormatException ignored) {
                        userId = null;
                    }
                }
            }

            // Parse membershipId tolerantly: accept Number or String code/name
            Long membershipId = null;
            Object midObj = request.get("membershipId");
            if (midObj != null) {
                if (midObj instanceof Number) {
                    membershipId = ((Number) midObj).longValue();
                } else {
                    try {
                        membershipId = Long.parseLong(midObj.toString());
                    } catch (NumberFormatException ignored) {
                        membershipId = null;
                    }
                }
            }

            String membershipCode = request.get("membershipCode") != null ? request.get("membershipCode").toString() : null;
            String userEmail = request.get("userEmail") != null ? request.get("userEmail").toString() : null;
            String userName = request.get("userName") != null ? request.get("userName").toString() : null;

            if (userId == null) {
                throw new RuntimeException("userId is required");
            }

            if (membershipId == null && membershipCode == null) {
                throw new RuntimeException("membershipId or membershipCode is required and must be valid");
            }

            logger.info("Resolved userId={} membershipId={} membershipCode={}", userId, membershipId, membershipCode);

            User_membership result = userMembershipService.buyMembership(
                    userId,
                    membershipId,
                    membershipCode,
                    userEmail,
                    userName
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

    @PostMapping("/use")
    public ResponseEntity<?> useMembership(@RequestBody Map<String, Object> request) {
        try {
            Object uidObj = request.get("userId");
            Object cidObj = request.get("courseId");
            Object midObj = request.get("membershipId");
            if (uidObj == null || cidObj == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "userId and courseId are required"));
            }
            Long userId = uidObj instanceof Number ? ((Number) uidObj).longValue() : Long.parseLong(uidObj.toString());
            Long courseId = cidObj instanceof Number ? ((Number) cidObj).longValue() : Long.parseLong(cidObj.toString());
            Long membershipId = null;
            if (midObj != null) {
                membershipId = midObj instanceof Number ? ((Number) midObj).longValue() : Long.parseLong(midObj.toString());
            }

            User_membership updated = userMembershipService.useMembership(userId, courseId, membershipId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            logger.error("useMembership failed", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}