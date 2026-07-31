package com.pokecontest.model;

import com.pokecontest.model.enums.SubmissionStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contest_id", nullable = false)
    private Contest contest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_id", nullable = false)
    private User artist;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String attacks;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionStatus status;

    private Double grade;

    @Column(name = "feedback_note", columnDefinition = "TEXT")
    private String feedbackNote;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Contest getContest() { return contest; }
    public void setContest(Contest contest) { this.contest = contest; }
    public User getArtist() { return artist; }
    public void setArtist(User artist) { this.artist = artist; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getAttacks() { return attacks; }
    public void setAttacks(String attacks) { this.attacks = attacks; }
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    public SubmissionStatus getStatus() { return status; }
    public void setStatus(SubmissionStatus status) { this.status = status; }
    public Double getGrade() { return grade; }
    public void setGrade(Double grade) { this.grade = grade; }
    public String getFeedbackNote() { return feedbackNote; }
    public void setFeedbackNote(String feedbackNote) { this.feedbackNote = feedbackNote; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
}
