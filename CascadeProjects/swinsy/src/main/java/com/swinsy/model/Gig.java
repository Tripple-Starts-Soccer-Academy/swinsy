package com.swinsy.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "gigs")
public class Gig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(length = 2000)
    private String description;
    private BigDecimal price;
    private String folder;
    private boolean locked;
    private boolean paused;
    private String documentFileName;
    private LocalDateTime deadline;

    public Gig() {
        this.locked = false;
        this.paused = false;
    }

    public Gig(String title, String description, BigDecimal price, String folder, boolean locked, boolean paused, String documentFileName, LocalDateTime deadline) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.folder = folder;
        this.locked = locked;
        this.paused = paused;
        this.documentFileName = documentFileName;
        this.deadline = deadline;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getFolder() { return folder; }
    public void setFolder(String folder) { this.folder = folder; }
    public boolean isLocked() { return locked; }
    public void setLocked(boolean locked) { this.locked = locked; }
    public boolean isPaused() { return paused; }
    public void setPaused(boolean paused) { this.paused = paused; }
    public String getDocumentFileName() { return documentFileName; }
    public void setDocumentFileName(String documentFileName) { this.documentFileName = documentFileName; }
    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }
}
