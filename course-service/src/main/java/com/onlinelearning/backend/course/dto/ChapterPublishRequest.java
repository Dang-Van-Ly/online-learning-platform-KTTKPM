package com.onlinelearning.backend.course.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

@Getter
@Setter
public class ChapterPublishRequest {
    @NotNull(message = "Mã khóa học không được để trống")
    private Long courseId;
    
    @NotBlank(message = "Tiêu đề chương không được để trống")
    private String title;

    @NotEmpty(message = "Chương phải có ít nhất 1 bài học")
    private List<LessonDto> lessons;

    @Getter
    @Setter
    public static class LessonDto {
        @NotBlank(message = "Tiêu đề bài học không được để trống")
        private String title;
        
        private String content;
        private Boolean isFree;
        
        // 1 file per lesson (optional)
        private String fileName;
        private String fileUrl;
        private String fileType;
    }
}
