package com.swinsy.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String studentName;
    @Column(length = 4000)
    private String content;
    @ManyToOne
    private Gig gig;
    private LocalDateTime submittedAt;

    @Enumerated(EnumType.STRING)
    private SubmissionStatus status = SubmissionStatus.PENDING;

    private boolean paid;
    private LocalDateTime paidAt;
    private String documentFileName;
    private String playerId;

    public enum SubmissionStatus {
        PENDING, APPROVED, REJECTED
    }

    public Submission() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Gig getGig() { return gig; }
    public void setGig(Gig gig) { this.gig = gig; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    public SubmissionStatus getStatus() { return status; }
    public void setStatus(SubmissionStatus status) { this.status = status; }
    public boolean isPaid() { return paid; }
    public void setPaid(boolean paid) { this.paid = paid; }
    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }
    public String getDocumentFileName() { return documentFileName; }
    public void setDocumentFileName(String documentFileName) { this.documentFileName = documentFileName; }
    public String getPlayerId() { return playerId; }
    public void setPlayerId(String playerId) { this.playerId = playerId; }
}
