package com.pokecontest.service;

import com.pokecontest.model.*;
import com.pokecontest.model.enums.*;
import com.pokecontest.repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class DataInitializerService {

    @Autowired
    private PokemonTypeRepository pokemonTypeRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ContestRepository contestRepository;
    @Autowired
    private PokemonRequestRepository pokemonRequestRepository;
    @Autowired
    private SubmissionRepository submissionRepository;
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    @Transactional
    public void initData() {
        if (pokemonTypeRepository.count() > 0) {
            return;
        }

        // Seed 18 Pokémon types
        String[][] typesData = {
                {"Normal", "#A8A878", "⭐"}, {"Fogo", "#F08030", "🔥"}, {"Água", "#6890F0", "💧"},
                {"Grama", "#78C850", "🌿"}, {"Elétrico", "#F8D030", "⚡"}, {"Gelo", "#98D8D8", "❄️"},
                {"Lutador", "#C03028", "🥊"}, {"Veneno", "#A040A0", "☠️"}, {"Terra", "#E0C068", "🌍"},
                {"Voador", "#A890F0", "🦅"}, {"Psíquico", "#F85888", "🧠"}, {"Inseto", "#A8B820", "🐛"},
                {"Pedra", "#B8A038", "🪨"}, {"Fantasma", "#705898", "👻"}, {"Dragão", "#7038F8", "🐉"},
                {"Sombrio", "#705848", "🌑"}, {"Aço", "#B8B8D0", "⚙️"}, {"Fada", "#EE99AC", "🧚"}
        };

        for (String[] t : typesData) {
            PokemonType pt = new PokemonType();
            pt.setName(t[0]);
            pt.setColor(t[1]);
            pt.setEmoji(t[2]);
            pokemonTypeRepository.save(pt);
        }

        // Seed 3 users
        String hashedPwd = passwordEncoder.encode("password");

        User boss = new User();
        boss.setUsername("boss_nexus");
        boss.setPasswordHash(hashedPwd);
        boss.setRole(Role.BOSS);
        boss.setInitials("BN");
        boss.setAvatarColor("avatar-red");
        userRepository.save(boss);

        User analyst = new User();
        analyst.setUsername("analyst_prime");
        analyst.setPasswordHash(hashedPwd);
        analyst.setRole(Role.ANALISTA);
        analyst.setInitials("AP");
        analyst.setAvatarColor("avatar-purple");
        userRepository.save(analyst);

        User artist = new User();
        artist.setUsername("arthur_v");
        artist.setPasswordHash(hashedPwd);
        artist.setRole(Role.ARTISTA);
        artist.setTier("Pro Artist");
        artist.setInitials("AR");
        artist.setAvatarColor("avatar-yellow");
        userRepository.save(artist);

        // Fetch types for contests
        PokemonType water = pokemonTypeRepository.findByName("Água").orElse(null);
        PokemonType ice = pokemonTypeRepository.findByName("Gelo").orElse(null);
        PokemonType fire = pokemonTypeRepository.findByName("Fogo").orElse(null);
        PokemonType psychic = pokemonTypeRepository.findByName("Psíquico").orElse(null);

        // Contest 1
        Contest c1 = new Contest();
        c1.setTitle("Campanha Lançamento Ethereal");
        c1.setStatus(ContestStatus.ACTIVE);
        c1.setPriority(ContestPriority.CRITICAL);
        c1.setBoss(boss);
        c1.setPokemonTypes(Set.of(water, ice));
        c1 = contestRepository.save(c1);

        PokemonRequest pr1 = new PokemonRequest();
        pr1.setContest(c1);
        pr1.setName("Lapras");
        pr1.setHabitat("Ilhas Seafoam");
        pr1.setBaseHp(130);
        pr1.setBaseAttack(85);
        pr1.setBaseDefense(80);
        pr1.setBaseSpAtk(85);
        pr1.setBaseSpDef(95);
        pr1.setBaseSpeed(60);
        pokemonRequestRepository.save(pr1);

        // Contest 2
        Contest c2 = new Contest();
        c2.setTitle("Redesign de Ativos Tier 3");
        c2.setStatus(ContestStatus.ACTIVE);
        c2.setPriority(ContestPriority.ROUTINE);
        c2.setBoss(boss);
        c2.setPokemonTypes(Set.of(fire));
        c2 = contestRepository.save(c2);

        PokemonRequest pr2 = new PokemonRequest();
        pr2.setContest(c2);
        pr2.setName("Arcanine");
        pr2.setHabitat("Cinnabar Island");
        pr2.setBaseHp(90);
        pr2.setBaseAttack(110);
        pr2.setBaseDefense(80);
        pr2.setBaseSpAtk(100);
        pr2.setBaseSpDef(80);
        pr2.setBaseSpeed(95);
        pokemonRequestRepository.save(pr2);

        // Contest 3
        Contest c3 = new Contest();
        c3.setTitle("Community Icons");
        c3.setStatus(ContestStatus.PENDING);
        c3.setPriority(ContestPriority.ROUTINE);
        c3.setBoss(boss);
        c3.setPokemonTypes(Set.of(psychic));
        c3 = contestRepository.save(c3);

        PokemonRequest pr3 = new PokemonRequest();
        pr3.setContest(c3);
        pr3.setName("Alakazam");
        pr3.setHabitat("Caverna de Cerulean");
        pr3.setBaseHp(55);
        pr3.setBaseAttack(50);
        pr3.setBaseDefense(45);
        pr3.setBaseSpAtk(135);
        pr3.setBaseSpDef(95);
        pr3.setBaseSpeed(120);
        pokemonRequestRepository.save(pr3);

        // Seed 3 submissions for contest 1 by arthur_v
        for (int i = 1; i <= 3; i++) {
            Submission sub = new Submission();
            sub.setContest(c1);
            sub.setArtist(artist);
            sub.setStatus(SubmissionStatus.PENDING);
            sub.setImageUrl("/uploads/artworks/sample.jpg");
            sub.setAttacks("Hydro Pump, Ice Beam, Surf, Body Slam");
            sub.setComments("Submission variation " + i + " for Lapras.");
            submissionRepository.save(sub);
        }

        // Seed 2 notifications for arthur_v
        Notification n1 = new Notification();
        n1.setUser(artist);
        n1.setMessage("Sua submissão para Lapras foi recebida.");
        notificationRepository.save(n1);

        Notification n2 = new Notification();
        n2.setUser(artist);
        n2.setMessage("O prazo do concurso 'Redesign de Ativos Tier 3' está se aproximando.");
        notificationRepository.save(n2);
    }
}
