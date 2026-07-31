package com.pokecontest.controller;

import com.pokecontest.model.PokemonType;
import com.pokecontest.repository.PokemonTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/pokemon-types")
public class PokemonTypeController {

    @Autowired
    private PokemonTypeRepository pokemonTypeRepository;

    @GetMapping
    public List<PokemonType> getAllTypes() {
        return pokemonTypeRepository.findAll();
    }
}
