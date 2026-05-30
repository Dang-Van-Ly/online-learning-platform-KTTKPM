package com.onlinelearning.backend.storage.controller;

import com.onlinelearning.backend.storage.service.LocalStorageService;
import com.onlinelearning.backend.storage.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/storage")
@RequiredArgsConstructor
public class S3Controller {

    private final S3Service s3Service;
    private final LocalStorageService localStorageService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = s3Service.uploadFile(file);
            return ResponseEntity.ok(fileUrl);
        } catch (Exception e) {
            try {
                String localUrl = localStorageService.saveFile(file, "lessons");
                return ResponseEntity.ok(localUrl);
            } catch (Exception localEx) {
                return ResponseEntity.internalServerError().body("Upload thất bại: " + localEx.getMessage());
            }
        }
    }
}
