package com.pokecontest.repository;

import com.pokecontest.model.PokemonRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PokemonRequestRepository extends JpaRepository<PokemonRequest, Long> {
    Optional<PokemonRequest> findByContestId(Long contestId);
}
