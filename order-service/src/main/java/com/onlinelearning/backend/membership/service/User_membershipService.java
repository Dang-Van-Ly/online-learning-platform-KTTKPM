package com.onlinelearning.backend.membership.service;

import com.onlinelearning.backend.membership.entity.Membership;
import com.onlinelearning.backend.membership.entity.User_membership;
import com.onlinelearning.backend.membership.repository.MembershipRepository;
import com.onlinelearning.backend.membership.repository.User_membershipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class User_membershipService {

    @Autowired
    private User_membershipRepository userMembershipRepository;

    @Autowired
    private MembershipRepository membershipRepository;

    public User_membership buyMembership(Long userId, Long membershipId) {

        // 1. Lấy membership
        Membership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new RuntimeException("Gói hội viên không tồn tại!"));

        // 2. Tạo user membership
        LocalDateTime now = LocalDateTime.now();
        User_membership um = new User_membership();
        um.setUserId(userId);
        um.setMembership(membership);
        um.setStartDate(now);
        um.setEndDate(now.plusDays(membership.getDurationDays()));
        um.setStatus("ACTIVE");

        // 3. Lưu vào DB
        return userMembershipRepository.save(um);
    }

    public List<User_membership> getUserMemberships(Long userId) {
        return userMembershipRepository.findByUserId(userId);
    }
}