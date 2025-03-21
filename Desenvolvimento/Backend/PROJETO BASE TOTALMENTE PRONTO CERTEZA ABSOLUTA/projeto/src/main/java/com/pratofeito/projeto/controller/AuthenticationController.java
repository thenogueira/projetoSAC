package com.pratofeito.projeto.controller;

import com.pratofeito.projeto.dto.AuthenticationDTO;
import com.pratofeito.projeto.dto.LoginResponseDTO;
import com.pratofeito.projeto.dto.RegisterDTO;
import com.pratofeito.projeto.model.Usuario;
import com.pratofeito.projeto.repository.UsuarioRepository;
import com.pratofeito.projeto.security.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador responsável por lidar com autenticação e registro de usuários.
 * Expõe endpoints para login e registro de novos usuários.
 */
@RestController
@CrossOrigin("*") // Permite requisições de qualquer origem
@RequestMapping("/auth") // Mapeia todas as requisições deste controlador para o caminho "/auth"
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager; // Gerenciador de autenticação do Spring Security

    @Autowired
    private UsuarioRepository repository; // Repositório para operações de banco de dados relacionadas ao usuário

    @Autowired
    private TokenService tokenService; // Serviço para geração de tokens JWT

    /**
     * Endpoint para autenticação de usuários.
     *
     * param data DTO contendo email e senha do usuário.
     * return ResponseEntity contendo o token JWT gerado para o usuário autenticado.
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid AuthenticationDTO data) {
        // Cria um token de autenticação com o email e senha fornecidos
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.senha_hash());

        // Autentica o usuário
        var auth = this.authenticationManager.authenticate(usernamePassword);

        // Obtém o usuário autenticado
        var usuario = (Usuario) auth.getPrincipal();

        // Gera um token JWT para o usuário
        var token = tokenService.generateToken(usuario);

        // Retorna o token no corpo da resposta
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    /**
     * Endpoint para registro de novos usuários.
     *
     * param data DTO contendo informações do novo usuário.
     * return ResponseEntity indicando sucesso ou falha no registro.
     */
    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegisterDTO data){
        // Verifica se o email já está em uso
        if(this.repository.findByEmail(data.email()).isPresent()) {
            return ResponseEntity.badRequest().body("O Email já existe");
        }

        // Criptografa a senha antes de salvar no banco de dados
        String encryptePassword = new BCryptPasswordEncoder().encode(data.senha_hash());

        // Cria um novo usuário com os dados fornecidos
        Usuario novoUsuario = new Usuario(data.nome(), data.email(), encryptePassword, data.tipoConta(), data.tipoDocumento(), data.numeroDocumento());

        // Salva o novo usuário no banco de dados
        this.repository.save(novoUsuario);

        // Retorna uma resposta de sucesso
        return ResponseEntity.ok().build();
    }
}