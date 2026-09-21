package com.swinsy.web;

import com.swinsy.model.Gig;
import com.swinsy.model.Submission;
import com.swinsy.service.GigService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Controller
public class StudentController {
    private final GigService gigService;

    public StudentController(GigService gigService) { this.gigService = gigService; }

    @GetMapping("/")
    public String home(Model model) {
        List<Gig> gigs = gigService.findAll();
        model.addAttribute("gigs", gigs);
        model.addAttribute("gigCollections", gigs.stream().filter(g -> "Gig Collection".equals(g.getFolder())).toList());
        model.addAttribute("workSubmissions", gigs.stream().filter(g -> "Work Submission".equals(g.getFolder())).toList());
        return "index";
    }

    @GetMapping("/gigs/{id}")
    public String gig(@PathVariable Long id, Model model) {
        Gig gig = gigService.findById(id);
        if (gig == null || gig.isLocked()) { return "redirect:/"; }
        model.addAttribute("gig", gig);
        model.addAttribute("submission", new Submission());
        return "gig";
    }

    @PostMapping("/gigs/{id}/submit")
    public String submit(@PathVariable Long id,
                         @RequestParam String studentName,
                         @RequestParam String playerId,
                         @RequestParam String content,
                         @RequestParam(required = false) MultipartFile document) {
        Gig gig = gigService.findById(id);
        if (gig == null || gig.isLocked() || gig.isPaused()) { return "redirect:/gigs/" + id; }
        gigService.submit(studentName, playerId, id, content, document);
        return "redirect:/gigs/" + id + "?submitted=1";
    }

    @PostMapping("/gigs/{id}/payment")
    public String payment(@PathVariable Long id,
                          @RequestParam String playerName,
                          @RequestParam String method,
                          @RequestParam String details) {
        Gig gig = gigService.findById(id);
        if (gig == null || gig.isLocked() || gig.isPaused()) { return "redirect:/gigs/" + id; }
        gigService.savePaymentInfo(id, playerName, method, details);
        return "redirect:/gigs/" + id + "?payment=1";
    }

    @GetMapping("/drive")
    public String drive(Model model) throws IOException {
        Path driveDir = Path.of("uploads", "baltimoredelima@gmail.com drive");
        List<String> files = new ArrayList<>();
        if (Files.exists(driveDir)) {
            try (var stream = Files.list(driveDir)) {
                stream.filter(Files::isRegularFile)
                      .forEach(p -> files.add(p.getFileName().toString()));
            }
        }
        Collections.sort(files);
        model.addAttribute("files", files);
        return "drive";
    }

    @GetMapping("/files/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) throws IOException {
        Path uploads = Path.of("uploads");
        Path file = uploads.resolve(filename);
        if (!Files.exists(file)) {
            try (var stream = Files.walk(uploads)) {
                file = stream.filter(p -> p.getFileName().toString().equals(filename) && Files.isRegularFile(p))
                             .findFirst().orElse(null);
            }
        }
        if (file == null || !Files.exists(file)) { return ResponseEntity.notFound().build(); }
        InputStreamResource resource = new InputStreamResource(Files.newInputStream(file));
        String downloadName = file.getFileName().toString();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + downloadName + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}
