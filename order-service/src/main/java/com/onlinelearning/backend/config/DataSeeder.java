package com.onlinelearning.backend.config;

import com.onlinelearning.backend.membership.entity.Membership;
import com.onlinelearning.backend.membership.repository.MembershipRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final MembershipRepository membershipRepository;

    public DataSeeder(MembershipRepository membershipRepository) {
        this.membershipRepository = membershipRepository;
    }

    @Override
    public void run(String... args) {
        if (membershipRepository.count() == 0) {
            List<Membership> packages = List.of(
                new Membership(null, "BASIC",    new BigDecimal("199000"), 10,  1, "ACTIVE", null),
                new Membership(null, "STANDARD", new BigDecimal("299000"), 30,  1, "ACTIVE", null),
                new Membership(null, "SILVER",   new BigDecimal("499000"), 90,  2, "ACTIVE", null),
                new Membership(null, "PREMIUM",  new BigDecimal("699000"), 90,  2, "ACTIVE", null),
                new Membership(null, "GOLD",     new BigDecimal("999000"), 365, 3, "ACTIVE", null),
                new Membership(null, "DIAMOND",  new BigDecimal("1499000"), 365, 3, "ACTIVE", null)
            );
            membershipRepository.saveAll(packages);
            System.out.println("✅ Seeded 6 membership packages.");
        } else {
            System.out.println("✅ Order Service started - membership data already exists.");
        }
    }
}
