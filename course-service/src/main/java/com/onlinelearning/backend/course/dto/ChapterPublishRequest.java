package com.onlinelearning.backend.course.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Getter
@Setter
public class ChapterPublishRequest {
    @NotNull(message = "Mã khóa học không được để trống")
    private Long courseId;
    
    @NotBlank(message = "Tiêu đề chương không được để trống")
    private String title;
    
    private String content;
    private List<FileDto> files;

    @Getter
    @Setter
    public static class FileDto {
        @NotBlank(message = "Tên tệp không được để trống")
        private String fileName;
        
        @NotBlank(message = "URL tệp không được để trống")
        private String fileUrl;
        
        @NotBlank(message = "Loại tệp không được để trống")
        private String fileType;
    }
}
