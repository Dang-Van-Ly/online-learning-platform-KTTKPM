package com.onlinelearning.backend.membership.service;

import com.onlinelearning.backend.membership.entity.Membership;
import com.onlinelearning.backend.membership.repository.MembershipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MembershipService {
    @Autowired
    private MembershipRepository membershipRepository;

    public List<Membership> getAllMemberships() {
        return membershipRepository.findAll();
    }

    public Membership createMembership(Membership membership) {
        return membershipRepository.save(membership);
    }
}