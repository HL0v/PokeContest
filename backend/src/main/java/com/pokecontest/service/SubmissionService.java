package com.pokecontest.service;

import com.pokecontest.model.Contest;
import com.pokecontest.model.Notification;
import com.pokecontest.model.Submission;
import com.pokecontest.model.User;
import com.pokecontest.model.enums.ContestStatus;
import com.pokecontest.model.enums.SubmissionStatus;
import com.pokecontest.repository.ContestRepository;
import com.pokecontest.repository.NotificationRepository;
import com.pokecontest.repository.SubmissionRepository;
import com.pokecontest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private ContestRepository contestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    private final String UPLOAD_DIR = "./uploads/artworks/";

    @Transactional(readOnly = true)
    public List<Submission> getSubmissionsByContestId(Long contestId) {
        List<Submission> subs = submissionRepository.findByContestId(contestId);
        subs.forEach(s -> {
            s.getArtist().getUsername();
            s.getContest().getTitle();
            if (s.getContest().getPokemonRequest() != null) {
                s.getContest().getPokemonRequest().getName();
            }
        });
        return subs;
    }

    @Transactional(readOnly = true)
    public List<Submission> getSubmissionsByArtistId(Long artistId) {
        List<Submission> subs = submissionRepository.findByArtistId(artistId);
        subs.forEach(s -> {
            s.getArtist().getUsername();
            s.getContest().getTitle();
        });
        return subs;
    }

    @Transactional
    public Submission createSubmission(Long contestId, Long artistId, String attacks, String comments, MultipartFile file) {
        Contest contest = contestRepository.findById(contestId).orElseThrow(() -> new RuntimeException("Contest not found"));
        User artist = userRepository.findById(artistId).orElseThrow(() -> new RuntimeException("Artist not found"));

        // Save file
        String imageUrl = null;
        if (file != null && !file.isEmpty()) {
            try {
                File uploadDir = new File(UPLOAD_DIR);
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }
                String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get(UPLOAD_DIR, filename);
                Files.copy(file.getInputStream(), filePath);
                imageUrl = "/uploads/artworks/" + filename;
            } catch (IOException e) {
                throw new RuntimeException("Failed to store file", e);
            }
        }

        Submission sub = new Submission();
        sub.setContest(contest);
        sub.setArtist(artist);
        sub.setAttacks(attacks);
        sub.setComments(comments);
        sub.setStatus(SubmissionStatus.PENDING);
        if (imageUrl != null) {
            sub.setImageUrl(imageUrl);
        }
        return submissionRepository.save(sub);
    }

    @Transactional
    public Submission reviewSubmission(Long id, String statusStr, Double grade, String feedbackNote) {
        Submission sub = submissionRepository.findById(id).orElseThrow(() -> new RuntimeException("Submission not found"));
        SubmissionStatus newStatus = SubmissionStatus.valueOf(statusStr.toUpperCase());
        sub.setStatus(newStatus);
        sub.setGrade(grade);
        sub.setFeedbackNote(feedbackNote);
        sub.setReviewedAt(LocalDateTime.now());
        
        submissionRepository.save(sub);

        if (newStatus == SubmissionStatus.DECLINED || newStatus == SubmissionStatus.REVISION) {
            Notification n = new Notification();
            n.setUser(sub.getArtist());
            String message = String.format("Sua submissão para '%s' foi avaliada com status: %s. Nota: %.2f", 
                    sub.getContest().getTitle(), newStatus.name(), grade != null ? grade : 0.0);
            n.setMessage(message);
            notificationRepository.save(n);
        } else if (newStatus == SubmissionStatus.ACCEPTED) {
            long acceptedCount = submissionRepository.countByContestIdAndStatus(sub.getContest().getId(), SubmissionStatus.ACCEPTED);
            if (acceptedCount >= sub.getContest().getRequiredSubmissions()) {
                Contest c = sub.getContest();
                c.setStatus(ContestStatus.COMPLETED);
                contestRepository.save(c);
            }
        }
        
        return sub;
    }
}
