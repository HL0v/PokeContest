package com.pokecontest.controller;

import com.pokecontest.model.User;
import com.pokecontest.model.enums.Role;
import com.pokecontest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pokecontest.dto.AuthResponse;
import com.pokecontest.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    public static class LoginRequest {
        @NotBlank(message = "Username cannot be empty")
        public String username;
        @NotBlank(message = "Password cannot be empty")
        public String password;
        public String role; // Provided in frontend for demo, ignoring for real auth
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username, request.password)
            );
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.username);
        final String jwt = jwtUtil.generateToken(userDetails);
        
        Optional<User> user = userRepository.findByUsername(request.username);
        if (user.isPresent()) {
            return ResponseEntity.ok(new AuthResponse(user.get(), jwt));
        }
        return ResponseEntity.status(401).build();
    }
}
