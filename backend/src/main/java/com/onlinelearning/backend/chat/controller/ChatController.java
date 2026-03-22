package com.onlinelearning.backend.chat.controller;

import com.onlinelearning.backend.chat.entity.Chat;
import com.onlinelearning.backend.chat.service.ChatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping
    public List<Chat> getAllChats() {
        return chatService.getAllChats();
    }

    @GetMapping("/{id}")
    public Optional<Chat> getChatById(@PathVariable Long id) {
        return chatService.getChatById(id);
    }

    @GetMapping("/room/{roomId}")
    public List<Chat> getChatsByRoom(@PathVariable Long roomId) {
        return chatService.getChatsByRoomId(roomId);
    }

    @PostMapping
    public Chat createChat(@RequestBody Chat chat) {
        return chatService.createChat(chat);
    }

    @PutMapping("/{id}")
    public Chat updateChat(@PathVariable Long id, @RequestBody Chat chat) {
        chat.setId(id);
        return chatService.updateChat(chat);
    }

    @DeleteMapping("/{id}")
    public void deleteChat(@PathVariable Long id) {
        chatService.deleteChat(id);
    }
}