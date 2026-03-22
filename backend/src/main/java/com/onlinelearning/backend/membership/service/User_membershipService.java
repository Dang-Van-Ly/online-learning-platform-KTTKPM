package com.onlinelearning.backend.membership.service;

import com.onlinelearning.backend.membership.entity.Membership;
import com.onlinelearning.backend.membership.entity.User_membership;
import com.onlinelearning.backend.membership.repository.MembershipRepository;
import com.onlinelearning.backend.membership.repository.User_membershipRepository;
import com.onlinelearning.backend.user.entity.User;
import com.onlinelearning.backend.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class User_membershipService {

    @Autowired
    private User_membershipRepository userMembershipRepository;

    @Autowired
    private MembershipRepository membershipRepository;

    @Autowired
    private UserRepository userRepository;

    public User_membership buyMembership(Long userId, Long membershipId) {

        // 1. Lấy user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại!"));

        // 2. Lấy membership
        Membership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new RuntimeException("Gói hội viên không tồn tại!"));

        // 3. Tạo user membership
        LocalDateTime now = LocalDateTime.now();
        User_membership um = new User_membership();
        um.setUser(user);
        um.setMembership(membership);
        um.setStartDate(now);
        um.setEndDate(now.plusDays(membership.getDurationDays()));
        um.setStatus("ACTIVE");

        // 4. Lưu vào DB
        return userMembershipRepository.save(um);
    }
}