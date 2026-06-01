package com.onlinelearning.chatservice.controller;

import com.onlinelearning.chatservice.dto.AgentRequest;
import com.onlinelearning.chatservice.dto.AgentResponse;
import com.onlinelearning.chatservice.service.ChatAgentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/agent")
public class ChatAgentController {

    private final ChatAgentService chatAgentService;

    public ChatAgentController(ChatAgentService chatAgentService) {
        this.chatAgentService = chatAgentService;
    }

    @PostMapping("/message")
    public AgentResponse sendMessage(@RequestBody AgentRequest request) {
        return chatAgentService.handle(request);
    }

    @GetMapping("/health")
    public String health() {
        return "Chat service OK";
    }
}
