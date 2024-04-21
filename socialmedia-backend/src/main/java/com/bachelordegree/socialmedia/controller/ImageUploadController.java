package com.bachelordegree.socialmedia.controller;

import com.bachelordegree.socialmedia.dto.UploadedImageDTO;
import com.bachelordegree.socialmedia.exception.RestException;
import com.bachelordegree.socialmedia.service.ImageUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/user/images")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ImageUploadController {

    private final ImageUploadService imageUploadService;

    @PostMapping("/{postId}/upload")
    public UploadedImageDTO uploadImageToPost(@PathVariable UUID postId, @RequestParam("image") MultipartFile file) {
        try {
            String imageUrl = imageUploadService.uploadImage(file);
            return new UploadedImageDTO(imageUrl);
        } catch (IOException e) {
            throw new RestException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}