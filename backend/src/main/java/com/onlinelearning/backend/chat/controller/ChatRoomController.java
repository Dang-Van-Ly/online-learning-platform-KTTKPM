package com.onlinelearning.backend.chat.controller;

import com.onlinelearning.backend.chat.entity.ChatRoom;
import com.onlinelearning.backend.chat.service.ChatRoomService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chat-rooms")
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    public ChatRoomController(ChatRoomService chatRoomService) {
        this.chatRoomService = chatRoomService;
    }

    @GetMapping
    public List<ChatRoom> getAllChatRooms() {
        return chatRoomService.getAllChatRooms();
    }

    @GetMapping("/{id}")
    public Optional<ChatRoom> getChatRoomById(@PathVariable Long id) {
        return chatRoomService.getChatRoomById(id);
    }

    @PostMapping
    public ChatRoom createChatRoom(@RequestBody ChatRoom chatRoom) {
        return chatRoomService.createChatRoom(chatRoom);
    }

    @PutMapping("/{id}")
    public ChatRoom updateChatRoom(@PathVariable Long id, @RequestBody ChatRoom chatRoom) {
        chatRoom.setId(id);
        return chatRoomService.updateChatRoom(chatRoom);
    }

    @DeleteMapping("/{id}")
    public void deleteChatRoom(@PathVariable Long id) {
        chatRoomService.deleteChatRoom(id);
    }
}