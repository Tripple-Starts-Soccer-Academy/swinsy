package com.swinsy.service;

import com.swinsy.model.Gig;
import com.swinsy.model.PaymentInfo;
import com.swinsy.model.Submission;
import com.swinsy.model.Submission.SubmissionStatus;
import com.swinsy.repository.GigRepository;
import com.swinsy.repository.PaymentInfoRepository;
import com.swinsy.repository.SubmissionRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class GigService {
    private final GigRepository gigRepository;
    private final SubmissionRepository submissionRepository;
    private final PaymentInfoRepository paymentInfoRepository;
    private final Path uploadDir = Path.of("uploads");

    public GigService(GigRepository gigRepository, SubmissionRepository submissionRepository, PaymentInfoRepository paymentInfoRepository) {
        this.gigRepository = gigRepository;
        this.submissionRepository = submissionRepository;
        this.paymentInfoRepository = paymentInfoRepository;
    }

    @PostConstruct
    public void seed() {
        if (gigRepository.count() == 0) {
            gigRepository.save(new Gig("Coffee growth in Africa",
                    "An easy research task about how coffee is grown across Africa.",
                    new BigDecimal("15.00"), "Gig Collection", false, false, null, null));
            gigRepository.save(new Gig("Land dimensions and measurements in Africa",
                    "Gather and present common land measurement units and practices used in Africa.",
                    new BigDecimal("35.00"), "Gig Collection", false, false, null, null));
            gigRepository.save(new Gig("Travel batch",
                    "A special locked batch of travel-related micro-tasks for approved students only.",
                    new BigDecimal("50.00"), "Gig Collection", true, false, null, null));
            gigRepository.save(new Gig("Housing situation in Uganda",
                    "What is the least expensive housing option in Uganda? Research and summarize your findings.",
                    new BigDecimal("25.00"), "Gig Collection", false, false, null, null));
            gigRepository.save(new Gig("Players health survey",
                    "Survey student athletes about their health habits and compile the results.",
                    new BigDecimal("40.00"), "Work Submission", false, false, null, null));
        }
    }

    public List<Gig> findAll() { return gigRepository.findAll(); }
    public List<Gig> findByFolder(String folder) { return gigRepository.findByFolder(folder); }
    public Gig findById(Long id) { return gigRepository.findById(id).orElse(null); }
    public Gig save(Gig gig) { return gigRepository.save(gig); }

    public void deleteGig(Long id) {
        Gig gig = findById(id);
        if (gig != null) {
            submissionRepository.findAll().stream()
                .filter(s -> s.getGig() != null && s.getGig().getId().equals(gig.getId()))
                .forEach(submissionRepository::delete);
            if (gig.getDocumentFileName() != null) {
                try {
                    Files.deleteIfExists(uploadDir.resolve(gig.getDocumentFileName()));
                } catch (IOException ignored) {}
            }
            gigRepository.delete(gig);
        }
    }

    public Gig togglePause(Long id) {
        Gig gig = findById(id);
        if (gig == null) return null;
        gig.setPaused(!gig.isPaused());
        return gigRepository.save(gig);
    }

    public String storeDocument(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;
        Files.createDirectories(uploadDir);
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), uploadDir.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
        return filename;
    }

    public String storeSubmissionDocument(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;
        Path driveDir = uploadDir.resolve("baltimoredelima@gmail.com drive");
        Files.createDirectories(driveDir);
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), driveDir.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
        return filename;
    }

    public List<Submission> findAllSubmissions() { return submissionRepository.findAll(); }
    public Submission findSubmissionById(Long id) { return submissionRepository.findById(id).orElse(null); }

    public Submission submit(String studentName, String playerId, Long gigId, String content, MultipartFile document) {
        Gig gig = findById(gigId);
        if (gig == null || gig.isLocked() || gig.isPaused()) { return null; }
        Submission submission = new Submission();
        submission.setStudentName(studentName);
        submission.setPlayerId(playerId);
        submission.setGig(gig);
        submission.setContent(content);
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setStatus(SubmissionStatus.PENDING);
        if (document != null && !document.isEmpty()) {
            try {
                submission.setDocumentFileName(storeSubmissionDocument(document));
            } catch (IOException ignored) {}
        }
        return submissionRepository.save(submission);
    }

    public Submission approveSubmission(Long id) {
        Submission s = findSubmissionById(id);
        if (s == null) return null;
        s.setStatus(SubmissionStatus.APPROVED);
        return submissionRepository.save(s);
    }

    public Submission rejectSubmission(Long id) {
        Submission s = findSubmissionById(id);
        if (s == null) return null;
        s.setStatus(SubmissionStatus.REJECTED);
        return submissionRepository.save(s);
    }

    public Submission paySubmission(Long id) {
        Submission s = findSubmissionById(id);
        if (s == null) return null;
        s.setPaid(true);
        s.setPaidAt(LocalDateTime.now());
        return submissionRepository.save(s);
    }

    public List<PaymentInfo> findAllPaymentInfos() { return paymentInfoRepository.findAll(); }

    public PaymentInfo savePaymentInfo(Long gigId, String playerName, String method, String details) {
        Gig gig = findById(gigId);
        if (gig == null) return null;
        PaymentInfo info = new PaymentInfo();
        info.setGig(gig);
        info.setPlayerName(playerName);
        info.setMethod(method);
        info.setDetails(details);
        info.setCreatedAt(LocalDateTime.now());
        return paymentInfoRepository.save(info);
    }
}
