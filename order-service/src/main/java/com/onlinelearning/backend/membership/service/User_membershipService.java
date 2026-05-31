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
import java.util.Optional;

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

    public User_membership buyMembership(Long userId, Long membershipId, String membershipCode,
                                          String userEmail, String userName) {
        if (membershipId == null && (membershipCode == null || membershipCode.isBlank())) {
            throw new RuntimeException("membershipId or membershipCode is required");
        }

        Optional<Membership> membershipOpt = Optional.empty();
        if (membershipId != null) {
            membershipOpt = membershipRepository.findById(membershipId);
        }
        if (membershipOpt.isEmpty() && membershipCode != null && !membershipCode.isBlank()) {
            membershipOpt = membershipRepository.findByNameIgnoreCase(membershipCode);
        }

        if (membershipOpt.isEmpty()) {
            throw new RuntimeException("Goi hoi vien khong ton tai!");
        }

        Membership membership = membershipOpt.get();
        return buyMembership(userId, membership.getId(), userEmail, userName);
    }

    public User_membership buyMembership(Long userId, Long membershipId,
                                          String userEmail, String userName) {
        if (membershipId == null) {
            throw new RuntimeException("membershipId is required");
        }

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

    public Optional<Membership> findMembershipByName(String name) {
        if (name == null) return Optional.empty();
        return membershipRepository.findByNameIgnoreCase(name);
    }

    public List<User_membership> getUserMemberships(Long userId) {
        return userMembershipRepository.findByUserId(userId);
    }

    public User_membership useMembership(Long userId, Long courseId, Long membershipId) {
        List<User_membership> memberships = userMembershipRepository.findByUserId(userId);
        LocalDateTime now = LocalDateTime.now();
        // find active membership (status ACTIVE and endDate after now), prefer latest endDate
        Optional<User_membership> opt = memberships.stream()
                .filter(u -> "ACTIVE".equals(u.getStatus()) && u.getEndDate() != null && u.getEndDate().isAfter(now))
                .filter(u -> membershipId == null || (u.getMembership() != null && u.getMembership().getId().equals(membershipId)))
                .sorted((a, b) -> b.getEndDate().compareTo(a.getEndDate()))
                .findFirst();

        if (opt.isEmpty()) {
            throw new RuntimeException("No active membership found for user");
        }

        User_membership um = opt.get();

        int prevUsedCourses = um.getUsedCourses() != null ? um.getUsedCourses() : 0;
        int prevUsedToday = um.getUsedToday() != null ? um.getUsedToday() : 0;
        LocalDateTime prevLastUsed = um.getLastUsedDate();

        boolean sameDay = prevLastUsed != null && prevLastUsed.toLocalDate().equals(now.toLocalDate());
        int newUsedToday = sameDay ? prevUsedToday + 1 : 1;

        um.setUsedCourses(prevUsedCourses + 1);
        um.setUsedToday(newUsedToday);
        um.setLastUsedDate(now);

        // append courseId to usedCourseIds (comma separated)
        String existing = um.getUsedCourseIds();
        String idStr = String.valueOf(courseId);
        if (existing == null || existing.isBlank()) {
            um.setUsedCourseIds(idStr);
        } else {
            // avoid duplicates
            String[] parts = existing.split(",");
            boolean found = false;
            for (String p : parts) if (p.equals(idStr)) { found = true; break; }
            if (!found) um.setUsedCourseIds(existing + "," + idStr);
        }

        return userMembershipRepository.save(um);
    }
}
