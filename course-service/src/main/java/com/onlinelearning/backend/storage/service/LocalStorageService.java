package com.onlinelearning.backend.storage.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Slf4j
@Service
public class LocalStorageService {

    @Value("${local.upload.dir:uploads}")
    private String uploadDir;

    public String saveFile(MultipartFile file, String folder) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File không được trống!");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        if (!StringUtils.hasText(originalFilename)) {
            originalFilename = "unnamed_file";
        }

        String sanitizedFilename = originalFilename.replaceAll("[^a-zA-Z0-9.\\-_]", "_");
        String generatedFilename = UUID.randomUUID() + "-" + sanitizedFilename;

        Path folderPath = Paths.get(uploadDir, folder).toAbsolutePath().normalize();
        Files.createDirectories(folderPath);

        Path targetPath = folderPath.resolve(generatedFilename);
        file.transferTo(targetPath.toFile());

        log.info("Saved local file: {}", targetPath);
        return "/uploads/" + folder + "/" + generatedFilename;
    }
}
