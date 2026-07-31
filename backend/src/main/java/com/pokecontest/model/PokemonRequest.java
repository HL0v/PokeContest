package com.pokecontest.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "pokemon_requests")
public class PokemonRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contest_id", nullable = false)
    @JsonIgnore
    private Contest contest;

    @Column(nullable = false)
    private String name;

    private String habitat;

    @Column(columnDefinition = "TEXT")
    private String history;

    @Column(name = "base_hp")
    private Integer baseHp;

    @Column(name = "base_attack")
    private Integer baseAttack;

    @Column(name = "base_defense")
    private Integer baseDefense;

    @Column(name = "base_sp_atk")
    private Integer baseSpAtk;

    @Column(name = "base_sp_def")
    private Integer baseSpDef;

    @Column(name = "base_speed")
    private Integer baseSpeed;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Contest getContest() { return contest; }
    public void setContest(Contest contest) { this.contest = contest; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getHabitat() { return habitat; }
    public void setHabitat(String habitat) { this.habitat = habitat; }
    public String getHistory() { return history; }
    public void setHistory(String history) { this.history = history; }
    public Integer getBaseHp() { return baseHp; }
    public void setBaseHp(Integer baseHp) { this.baseHp = baseHp; }
    public Integer getBaseAttack() { return baseAttack; }
    public void setBaseAttack(Integer baseAttack) { this.baseAttack = baseAttack; }
    public Integer getBaseDefense() { return baseDefense; }
    public void setBaseDefense(Integer baseDefense) { this.baseDefense = baseDefense; }
    public Integer getBaseSpAtk() { return baseSpAtk; }
    public void setBaseSpAtk(Integer baseSpAtk) { this.baseSpAtk = baseSpAtk; }
    public Integer getBaseSpDef() { return baseSpDef; }
    public void setBaseSpDef(Integer baseSpDef) { this.baseSpDef = baseSpDef; }
    public Integer getBaseSpeed() { return baseSpeed; }
    public void setBaseSpeed(Integer baseSpeed) { this.baseSpeed = baseSpeed; }
}
