package com.bachelordegree.socialmedia.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageUploadService {
    private final AmazonS3 amazonS3;

    @Value("${app.s3.bucket}")
    private String bucketName;

    public String uploadImage(MultipartFile file) throws IOException {
        String fileKey = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
        amazonS3.putObject(new PutObjectRequest(bucketName, fileKey, file.getInputStream(), null)
                .withCannedAcl(CannedAccessControlList.PublicRead));

        return amazonS3.getUrl(bucketName, fileKey).toString();
    }
}