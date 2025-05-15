package com.pratofeito.projeto.controller;

import com.pratofeito.projeto.dto.AuthenticationDTO;
import com.pratofeito.projeto.dto.LoginResponseDTO;
import com.pratofeito.projeto.dto.RegisterDTO;
import com.pratofeito.projeto.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para operações de autenticação e registro de usuários.
 *
 * <p>Responsável por gerenciar o fluxo de autenticação (login) e cadastro (registro)
 * de usuários no sistema. Todos os endpoints estão mapeados sob o caminho base "/auth".</p>
 *
 * <p>Permite requisições de qualquer origem (CORS) através da anotação @CrossOrigin("*").</p>
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/auth")
public class AuthenticationController {

    private final AuthService authService; // Serviço que contém a lógica de autenticação

    /**
     * Construtor para injeção de dependência do AuthService.
     *
     * @param authService Serviço de autenticação a ser injetado
     */
    public AuthenticationController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Endpoint para autenticação (login) de usuários.
     *
     * @param data DTO contendo as credenciais de login (email e senha)
     * @return ResponseEntity contendo token e mensagens de erro em caso de falha
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid AuthenticationDTO data) {
        LoginResponseDTO response = authService.login(data);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para registro de novos usuários.
     *
     * @param data DTO contendo os dados necessários para registro do usuário
     * @return ResponseEntity vazio em caso de sucesso ou mensagem de erro em caso de falha
     */
    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody @Valid RegisterDTO data) {
        // Chamar o serviço para processar o registro
        authService.register(data);
        return ResponseEntity.ok().build();
    }
}
