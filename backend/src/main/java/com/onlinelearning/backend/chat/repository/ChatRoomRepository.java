package com.onlinelearning.backend.chat.repository;

import com.onlinelearning.backend.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
}