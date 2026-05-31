package com.onlinelearning.backend.membership.service;

import com.onlinelearning.backend.membership.entity.Membership;
import com.onlinelearning.backend.membership.entity.User_membership;
import com.onlinelearning.backend.membership.repository.MembershipRepository;
import com.onlinelearning.backend.membership.repository.User_membershipRepository;
import com.onlinelearning.backend.messaging.EventPublisher;
import com.onlinelearning.backend.messaging.MembershipBoughtEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class User_membershipService {

    @Autowired
    private User_membershipRepository userMembershipRepository;

    @Autowired
    private MembershipRepository membershipRepository;

    @Autowired
    private EventPublisher eventPublisher;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public User_membership buyMembership(Long userId, Long membershipId) {
        return buyMembership(userId, membershipId, null, null);
    }

    public User_membership buyMembership(Long userId, Long membershipId,
                                          String userEmail, String userName) {
        // 1. Lay membership
        Membership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new RuntimeException("Goi hoi vien khong ton tai!"));

        // 2. Tao user membership
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime endDate = now.plusDays(membership.getDurationDays());

        User_membership um = new User_membership();
        um.setUserId(userId);
        um.setMembership(membership);
        um.setStartDate(now);
        um.setEndDate(endDate);
        um.setStatus("ACTIVE");

        // 3. Luu vao DB
        User_membership saved = userMembershipRepository.save(um);

        // 4. Publish event to RabbitMQ (chi khi co email)
        if (userEmail != null && !userEmail.isBlank()) {
            MembershipBoughtEvent event = MembershipBoughtEvent.builder()
                    .userId(userId)
                    .userEmail(userEmail)
                    .userName(userName != null ? userName : "Hoc vien")
                    .membershipName(membership.getName())
                    .price(membership.getPrice())
                    .durationDays(membership.getDurationDays())
                    .startDate(now.format(FORMATTER))
                    .endDate(endDate.format(FORMATTER))
                    .build();
            eventPublisher.publishMembershipBought(event);
        }

        return saved;
    }

    public List<User_membership> getUserMemberships(Long userId) {
        return userMembershipRepository.findByUserId(userId);
    }
}
