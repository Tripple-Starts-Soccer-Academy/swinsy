package com.swinsy.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_infos")
public class PaymentInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Gig gig;

    private String playerName;
    private String method;

    @Column(length = 4000)
    private String details;

    private LocalDateTime createdAt;

    public PaymentInfo() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Gig getGig() { return gig; }
    public void setGig(Gig gig) { this.gig = gig; }

    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
