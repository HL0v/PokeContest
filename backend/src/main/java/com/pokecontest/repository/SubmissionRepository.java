package com.pokecontest.repository;

import com.pokecontest.model.Submission;
import com.pokecontest.model.enums.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByContestId(Long contestId);
    List<Submission> findByArtistId(Long artistId);
    List<Submission> findByStatus(SubmissionStatus status);
    long countByContestIdAndStatus(Long contestId, SubmissionStatus status);
    
    // For analyst dashboard to fetch submissions pending or in revision
    List<Submission> findByStatusIn(List<SubmissionStatus> statuses);
}
