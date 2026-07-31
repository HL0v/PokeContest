package com.pokecontest.service;

import com.pokecontest.model.Contest;
import com.pokecontest.model.PokemonRequest;
import com.pokecontest.model.PokemonType;
import com.pokecontest.model.User;
import com.pokecontest.model.enums.ContestPriority;
import com.pokecontest.model.enums.ContestStatus;
import com.pokecontest.model.enums.SubmissionStatus;
import com.pokecontest.repository.ContestRepository;
import com.pokecontest.repository.PokemonRequestRepository;
import com.pokecontest.repository.PokemonTypeRepository;
import com.pokecontest.repository.SubmissionRepository;
import com.pokecontest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ContestService {

    @Autowired
    private ContestRepository contestRepository;

    @Autowired
    private PokemonRequestRepository pokemonRequestRepository;

    @Autowired
    private PokemonTypeRepository pokemonTypeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Transactional(readOnly = true)
    public List<Contest> getAllContests() {
        List<Contest> contests = contestRepository.findAll();
        // Force initialization
        contests.forEach(c -> {
            c.getPokemonTypes().size();
            c.getBoss().getUsername();
            if (c.getPokemonRequest() != null) {
                c.getPokemonRequest().getName();
            }
        });
        return contests;
    }

    @Transactional(readOnly = true)
    public List<Contest> getActiveContests() {
        List<Contest> contests = contestRepository.findByStatus(ContestStatus.ACTIVE);
        contests.forEach(c -> {
            c.getPokemonTypes().size();
            c.getBoss().getUsername();
            if (c.getPokemonRequest() != null) {
                c.getPokemonRequest().getName();
            }
        });
        return contests;
    }

    @Transactional(readOnly = true)
    public Optional<Contest> getContestById(Long id) {
        Optional<Contest> contestOpt = contestRepository.findById(id);
        contestOpt.ifPresent(c -> {
            c.getPokemonTypes().size();
            c.getBoss().getUsername();
            if (c.getPokemonRequest() != null) {
                c.getPokemonRequest().getName();
            }
        });
        return contestOpt;
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getBossStats(Long bossId) {
        List<Contest> bossContests = contestRepository.findByBossId(bossId);
        long total = bossContests.size();
        long active = bossContests.stream().filter(c -> c.getStatus() == ContestStatus.ACTIVE).count();
        long completed = bossContests.stream().filter(c -> c.getStatus() == ContestStatus.COMPLETED).count();

        long pendingSubmissions = bossContests.stream()
                .flatMap(c -> submissionRepository.findByContestId(c.getId()).stream())
                .filter(s -> s.getStatus() == SubmissionStatus.PENDING)
                .count();

        Map<String, Long> stats = new HashMap<>();
        stats.put("totalContests", total);
        stats.put("activeContests", active);
        stats.put("pendingSubmissions", pendingSubmissions);
        stats.put("completedContests", completed);
        return stats;
    }

    @Transactional
    public Contest createContest(String title, Long bossId, String priorityStr, List<Long> pokemonTypeIds, PokemonRequest prData) {
        User boss = userRepository.findById(bossId).orElseThrow(() -> new RuntimeException("Boss not found"));
        
        Contest contest = new Contest();
        contest.setTitle(title);
        contest.setBoss(boss);
        contest.setStatus(ContestStatus.ACTIVE);
        try {
            contest.setPriority(ContestPriority.valueOf(priorityStr.toUpperCase()));
        } catch (Exception e) {
            contest.setPriority(ContestPriority.ROUTINE);
        }

        Set<PokemonType> types = new HashSet<>();
        for (Long typeId : pokemonTypeIds) {
            pokemonTypeRepository.findById(typeId).ifPresent(types::add);
        }
        contest.setPokemonTypes(types);

        Contest savedContest = contestRepository.save(contest);

        prData.setContest(savedContest);
        pokemonRequestRepository.save(prData);
        savedContest.setPokemonRequest(prData);
        
        return savedContest;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getAnalystStats() {
        List<Contest> activeContestsList = contestRepository.findByStatus(ContestStatus.ACTIVE);
        long activeContests = activeContestsList.size();
        
        long pendingFromBoss = activeContestsList.stream().filter(c -> c.getStatus() == ContestStatus.PENDING).count(); // Usually boss submits as PENDING? Wait, the prompt says "pendingFromBoss (long)". If the contest is PENDING, it's from boss. Wait, activeContests is ACTIVE. Let's re-read the prompt: 
        // "pendingFromBoss (long), worksToValidate (long, submissions with PENDING or REVISION status), avgValidationTime (String, compute from reviewed submissions or return "N/A")"
        long pendingContests = contestRepository.findByStatus(ContestStatus.PENDING).size();

        List<SubmissionStatus> pendingStatuses = Arrays.asList(SubmissionStatus.PENDING, SubmissionStatus.REVISION);
        long worksToValidate = submissionRepository.findByStatusIn(pendingStatuses).size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("activeContests", activeContests);
        stats.put("pendingFromBoss", pendingContests);
        stats.put("worksToValidate", worksToValidate);
        stats.put("avgValidationTime", "N/A"); // simplified for now
        
        return stats;
    }
}
