package com.onlinelearning.backend.storage.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Client s3Client;

    @Value("${AWS_BUCKET_NAME}")
    private String bucketName;

    @Value("${AWS_REGION}")
    private String region;

    /**
     * Upload mặc định vào thư mục "uploads" nếu không truyền tên folder
     */
    public String uploadFile(MultipartFile file) throws IOException {
        return uploadFile(file, "uploads");
    }

    /**
     * Hàm xử lý upload file cốt lõi lên AWS S3
     */
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File không được trống!");
        }

        String originalFilename = file.getOriginalFilename();
        if (!StringUtils.hasText(originalFilename)) {
            originalFilename = "unnamed_file";
        } else {
            originalFilename = originalFilename.replaceAll("[^a-zA-Z0-9.\\-_]", "_");
        }

        String cleanFolder = StringUtils.hasText(folder) ? folder.trim() + "/" : "";
        String key = cleanFolder + UUID.randomUUID() + "-" + originalFilename;

        log.info("Bắt đầu upload file lên S3 với Key: {}", key);

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));
            String publicUrl = s3Client.utilities().getUrl(builder -> builder.bucket(bucketName).key(key)).toExternalForm();
            log.info("Upload thành công! URL công khai: {}", publicUrl);
            return publicUrl;

        } catch (Exception e) {
            log.error("Lỗi xảy ra khi upload file lên S3: {}", e.getMessage(), e);
            throw new IOException("Không thể upload file lên hệ thống lưu trữ S3", e);
        }
    }

    /**
     * Upload ảnh thu nhỏ của khóa học tự động vào thư mục "thumbnails"
     */
    public String uploadCourseThumbnail(MultipartFile image) throws IOException {
        return uploadFile(image, "thumbnails");
    }
}
