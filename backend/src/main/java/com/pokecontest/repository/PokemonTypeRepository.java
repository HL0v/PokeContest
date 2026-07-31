package com.pokecontest.repository;

import com.pokecontest.model.PokemonType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PokemonTypeRepository extends JpaRepository<PokemonType, Long> {
}
