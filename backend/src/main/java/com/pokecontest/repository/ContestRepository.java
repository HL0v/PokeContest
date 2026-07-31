package com.pokecontest.repository;

import com.pokecontest.model.Contest;
import com.pokecontest.model.enums.ContestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContestRepository extends JpaRepository<Contest, Long> {
    List<Contest> findByStatus(ContestStatus status);
    List<Contest> findByBossId(Long bossId);
}
