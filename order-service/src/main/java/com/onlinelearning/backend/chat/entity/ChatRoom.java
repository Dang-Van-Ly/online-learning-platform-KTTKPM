package com.onlinelearning.backend.chat.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "chat_rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // người tạo phòng
    private String name;
    private String session; // session id hoặc code

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Chat> chats;
}