package com.onlinelearning.backend.membership.repository;

import com.onlinelearning.backend.membership.entity.User_membership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface User_membershipRepository extends JpaRepository<User_membership, Long> {
    List<User_membership> findByUserId(Long userId);
}