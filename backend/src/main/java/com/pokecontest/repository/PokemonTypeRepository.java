package com.pokecontest.repository;

import com.pokecontest.model.PokemonType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PokemonTypeRepository extends JpaRepository<PokemonType, Long> {
    Optional<PokemonType> findByName(String name);
}
