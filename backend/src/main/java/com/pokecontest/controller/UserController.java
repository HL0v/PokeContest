package com.pokecontest.controller;

import com.pokecontest.model.User;
import com.pokecontest.model.enums.Role;
import com.pokecontest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public static class CreateUserRequest {
        public String username;
        public String password;
        public String role;
        public String tier;
        public String avatarColor;
        public String initials;
    }

    @GetMapping
    @PreAuthorize("hasRole('BOSS')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('BOSS')")
    public ResponseEntity<User> createUser(@RequestBody CreateUserRequest req) {
        if (userRepository.findByUsername(req.username).isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        User user = new User();
        user.setUsername(req.username);
        user.setPasswordHash(passwordEncoder.encode(req.password));
        user.setRole(Role.valueOf(req.role));
        user.setTier(req.tier);
        user.setAvatarColor(req.avatarColor != null ? req.avatarColor : "avatar-gray");
        user.setInitials(req.initials != null ? req.initials : "??");
        return ResponseEntity.ok(userRepository.save(user));
    }
}
