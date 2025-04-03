package com.pratofeito.projeto.controller;

import com.pratofeito.projeto.dto.AuthenticationDTO;
import com.pratofeito.projeto.dto.LoginResponseDTO;
import com.pratofeito.projeto.dto.RegisterDTO;
import com.pratofeito.projeto.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador responsável por lidar com autenticação e registro de usuários.
 * Expõe endpoints para login e registro de novos usuários.
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/auth")
public class AuthenticationController {

    private final AuthService authService;

    public AuthenticationController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid AuthenticationDTO data) {
        LoginResponseDTO response = authService.login(data);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterDTO data) {
        try {
            authService.register(data);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Ocorreu um erro durante o registro: " + e.getMessage());
        }
    }
}