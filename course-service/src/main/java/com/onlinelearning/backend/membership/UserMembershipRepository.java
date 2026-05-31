package com.onlinelearning.backend.membership;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserMembershipRepository extends JpaRepository<UserMembership, Long> {

    /**
     * Lấy tất cả membership ACTIVE còn hạn của user, sắp xếp mới nhất trước.
     */
    @Query("SELECT um FROM UserMembership um " +
           "WHERE um.userId = :userId " +
           "AND um.status = 'ACTIVE' " +
           "AND um.endDate > :now " +
           "ORDER BY um.endDate DESC")
    List<UserMembership> findActiveMemberships(
            @Param("userId") Long userId,
            @Param("now") LocalDateTime now);

    default Optional<UserMembership> findActiveMembership(Long userId, LocalDateTime now) {
        List<UserMembership> list = findActiveMemberships(userId, now);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }
}
