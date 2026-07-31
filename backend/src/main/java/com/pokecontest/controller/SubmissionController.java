package com.pokecontest.controller;

import com.pokecontest.model.Submission;
import com.pokecontest.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @GetMapping
    public List<Submission> getSubmissionsByContestId(@RequestParam Long contestId) {
        return submissionService.getSubmissionsByContestId(contestId);
    }

    @GetMapping("/artist/{artistId}")
    public List<Submission> getSubmissionsByArtistId(@PathVariable Long artistId) {
        return submissionService.getSubmissionsByArtistId(artistId);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ARTISTA')")
    public ResponseEntity<Submission> createSubmission(
            @RequestParam("contestId") Long contestId,
            @RequestParam("artistId") Long artistId,
            @RequestParam(value = "attacks", required = false) String attacks,
            @RequestParam(value = "comments", required = false) String comments,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(submissionService.createSubmission(contestId, artistId, attacks, comments, file));
    }

    public static class ReviewDto {
        @NotBlank(message = "Status cannot be empty")
        public String status;
        public Double grade;
        public String feedbackNote;
    }

    @PutMapping("/{id}/review")
    @PreAuthorize("hasRole('ANALISTA')")
    public ResponseEntity<Submission> reviewSubmission(@PathVariable Long id, @Valid @RequestBody ReviewDto dto) {
        return ResponseEntity.ok(submissionService.reviewSubmission(id, dto.status, dto.grade, dto.feedbackNote));
    }
}
