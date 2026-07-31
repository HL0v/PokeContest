package com.pokecontest.model;

import com.pokecontest.model.enums.ContestPriority;
import com.pokecontest.model.enums.ContestStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "contests")
public class Contest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "boss_id", nullable = false)
    private User boss;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContestStatus status;

    @Enumerated(EnumType.STRING)
    private ContestPriority priority;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToOne(mappedBy = "contest", cascade = CascadeType.ALL)
    private PokemonRequest pokemonRequest;

    @ManyToMany
    @JoinTable(
        name = "contest_pokemon_types",
        joinColumns = @JoinColumn(name = "contest_id"),
        inverseJoinColumns = @JoinColumn(name = "type_id")
    )
    private Set<PokemonType> pokemonTypes;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getBoss() { return boss; }
    public void setBoss(User boss) { this.boss = boss; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public ContestStatus getStatus() { return status; }
    public void setStatus(ContestStatus status) { this.status = status; }
    public ContestPriority getPriority() { return priority; }
    public void setPriority(ContestPriority priority) { this.priority = priority; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public PokemonRequest getPokemonRequest() { return pokemonRequest; }
    public void setPokemonRequest(PokemonRequest pokemonRequest) { this.pokemonRequest = pokemonRequest; }
    public Set<PokemonType> getPokemonTypes() { return pokemonTypes; }
    public void setPokemonTypes(Set<PokemonType> pokemonTypes) { this.pokemonTypes = pokemonTypes; }
}
