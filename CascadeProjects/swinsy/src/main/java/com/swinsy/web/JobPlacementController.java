package com.swinsy.web;

import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

@Controller
public class JobPlacementController {
    private final Path resumeDir = Path.of("uploads/resumes");

    @PostMapping("/job-placement/resume")
    public String uploadResume(@RequestParam String name, @RequestParam MultipartFile resume) {
        if (resume != null && !resume.isEmpty()) {
            try {
                Files.createDirectories(resumeDir);
                String filename = System.currentTimeMillis() + "_" + resume.getOriginalFilename();
                Files.copy(resume.getInputStream(), resumeDir.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException ignored) {}
        }
        return "redirect:/job-placement.html";
    }

    @GetMapping("/resumes/{filename}")
    public ResponseEntity<Resource> downloadResume(@PathVariable String filename) throws IOException {
        Path file = resumeDir.resolve(filename);
        if (!Files.exists(file)) { return ResponseEntity.notFound().build(); }
        InputStreamResource resource = new InputStreamResource(Files.newInputStream(file));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}
