package com.onlinelearning.chatservice.controller;

import com.onlinelearning.chatservice.dto.AgentRequest;
import com.onlinelearning.chatservice.dto.AgentResponse;
import com.onlinelearning.chatservice.service.ChatAgentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatAgentService chatAgentService;

    public ChatController(ChatAgentService chatAgentService) {
        this.chatAgentService = chatAgentService;
    }

    @PostMapping("/ask")
    public ResponseEntity<AgentResponse> ask(@RequestBody AgentRequest request) {
        return ResponseEntity.ok(chatAgentService.handle(request));
    }
}