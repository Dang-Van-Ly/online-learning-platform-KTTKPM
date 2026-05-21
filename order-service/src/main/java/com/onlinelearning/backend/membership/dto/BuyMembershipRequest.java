package com.onlinelearning.backend.membership.dto;

public class BuyMembershipRequest {

    private Long userId;
    private Long membershipId;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getMembershipId() {
        return membershipId;
    }

    public void setMembershipId(Long membershipId) {
        this.membershipId = membershipId;
    }
}