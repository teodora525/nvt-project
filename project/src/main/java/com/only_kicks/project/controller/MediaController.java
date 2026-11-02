package com.only_kicks.project.controller;

import com.only_kicks.project.dto.PresignedUrlResponseDto;
import com.only_kicks.project.service.MinioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MinioService minioService;

    @GetMapping("/presigned-url")
    public ResponseEntity<PresignedUrlResponseDto> getPresignedUrl(@RequestParam("filename") String filename) {
        return ResponseEntity.ok(minioService.generatePresignedUploadUrl(filename));
    }
}
