package com.onlinelearning.backend.chat.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;   // nội dung tin nhắn
    private String name;      // tên hiển thị người gửi
    private String sender;    // senderId
    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "chat_room_id")
    @ToString.Exclude
    private ChatRoom chatRoom;

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }
}