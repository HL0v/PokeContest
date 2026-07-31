package com.pokecontest.controller;

import com.pokecontest.service.ContestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/analyst")
public class AnalystController {

    @Autowired
    private ContestService contestService;

    @GetMapping("/stats")
    public Map<String, Object> getAnalystStats() {
        return contestService.getAnalystStats();
    }
}
