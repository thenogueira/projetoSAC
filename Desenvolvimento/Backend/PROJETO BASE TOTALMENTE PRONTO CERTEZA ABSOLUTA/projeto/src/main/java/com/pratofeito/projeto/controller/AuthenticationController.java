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
     * @return ResponseEntity contendo o token de autenticação e informações do usuário
     * @throws jakarta.validation.ValidationException Se os dados de entrada forem inválidos
     * @apiNote POST /auth/login
     * @response HTTP 200 (OK) com o token JWT e dados do usuário autenticado
     * @response HTTP 400 (Bad Request) se as credenciais forem inválidas ou dados incorretos
     * @response HTTP 401 (Unauthorized) se a autenticação falhar
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid AuthenticationDTO data) {
        // Delegar a lógica de autenticação para o serviço
        LoginResponseDTO response = authService.login(data);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para registro de novos usuários.
     *
     * @param data DTO contendo os dados necessários para registro do usuário
     * @return ResponseEntity vazio em caso de sucesso ou mensagem de erro em caso de falha
     * @throws IllegalArgumentException Se os dados de registro forem inválidos
     * @apiNote POST /auth/register
     * @response HTTP 200 (OK) se o registro for bem-sucedido
     * @response HTTP 400 (Bad Request) se os dados de registro forem inválidos
     * @response HTTP 409 (Conflict) se o email já estiver em uso
     * @response HTTP 500 (Internal Server Error) em caso de erro inesperado
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterDTO data) {
        try {
            // Chamar o serviço para processar o registro
            authService.register(data);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            // Retornar erro 400 para dados inválidos
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // Retornar erro 500 para exceções inesperadas
            return ResponseEntity.internalServerError().body("Ocorreu um erro durante o registro: " + e.getMessage());
        }
    }
}