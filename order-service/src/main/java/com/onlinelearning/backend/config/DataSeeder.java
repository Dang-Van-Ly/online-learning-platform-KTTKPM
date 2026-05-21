package com.onlinelearning.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Override
    public void run(String... args) {
        System.out.println("✅ Order Service started - no seed data needed.");
    }
}
