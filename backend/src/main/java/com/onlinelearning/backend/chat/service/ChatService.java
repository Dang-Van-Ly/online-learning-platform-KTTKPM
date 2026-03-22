package com.onlinelearning.backend.chat.service;

import com.onlinelearning.backend.chat.entity.Chat;
import com.onlinelearning.backend.chat.repository.ChatRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChatService {

    private final ChatRepository chatRepository;

    public ChatService(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }

    public List<Chat> getAllChats() {
        return chatRepository.findAll();
    }

    public List<Chat> getChatsByRoomId(Long chatRoomId) {
        return chatRepository.findByChatRoomId(chatRoomId);
    }

    public Optional<Chat> getChatById(Long id) {
        return chatRepository.findById(id);
    }

    public Chat createChat(Chat chat) {
        return chatRepository.save(chat);
    }

    public Chat updateChat(Chat chat) {
        return chatRepository.save(chat);
    }

    public void deleteChat(Long id) {
        chatRepository.deleteById(id);
    }
}