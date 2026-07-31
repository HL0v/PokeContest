package com.pokecontest.controller;

import com.pokecontest.model.Contest;
import com.pokecontest.model.PokemonRequest;
import com.pokecontest.service.ContestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/contests")
public class ContestController {

    @Autowired
    private ContestService contestService;

    @GetMapping
    public List<Contest> getAllContests() {
        return contestService.getAllContests();
    }

    @GetMapping("/active")
    public List<Contest> getActiveContests() {
        return contestService.getActiveContests();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contest> getContestById(@PathVariable Long id) {
        Optional<Contest> contest = contestService.getContestById(id);
        return contest.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/boss/{bossId}/stats")
    public Map<String, Long> getBossStats(@PathVariable Long bossId) {
        return contestService.getBossStats(bossId);
    }

    public static class CreateContestDto {
        @NotBlank(message = "Title is required")
        public String title;
        @NotNull(message = "Boss ID is required")
        public Long bossId;
        @NotBlank(message = "Priority is required")
        public String priority;
        @NotNull(message = "Pokemon Types are required")
        @Size(min = 1, message = "At least one type is required")
        public List<Long> pokemonTypeIds;
        @NotNull(message = "Pokemon Request is required")
        public PokemonRequest pokemonRequest;
    }

    @PostMapping
    @PreAuthorize("hasRole('BOSS')")
    public Contest createContest(@Valid @RequestBody CreateContestDto dto) {
        return contestService.createContest(
            dto.title,
            dto.bossId,
            dto.priority,
            dto.pokemonTypeIds,
            dto.pokemonRequest
        );
    }
}
