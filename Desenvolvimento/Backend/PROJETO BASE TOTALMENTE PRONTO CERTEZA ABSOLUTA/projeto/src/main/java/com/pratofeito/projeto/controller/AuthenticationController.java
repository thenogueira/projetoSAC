package com.pratofeito.projeto.controller;

import com.pratofeito.projeto.dto.AuthenticationDTO;
import com.pratofeito.projeto.dto.LoginResponseDTO;
import com.pratofeito.projeto.dto.RegisterDTO;
import com.pratofeito.projeto.model.Usuario;
import com.pratofeito.projeto.model.enums.TipoDocumento;
import com.pratofeito.projeto.repository.UsuarioRepository;
import com.pratofeito.projeto.security.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * Controlador responsável por lidar com autenticação e registro de usuários.
 * Expõe endpoints para login e registro de novos usuários.
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid AuthenticationDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.senha_hash());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        var usuario = (Usuario) auth.getPrincipal();
        var token = tokenService.generateToken(usuario);
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterDTO data) {
        try {
            // Verifica se o email já está em uso
            if(this.repository.findByEmail(data.email()).isPresent()) {
                return ResponseEntity.badRequest().body("Email já cadastrado");
            }

            // Verifica se o documento já está cadastrado
            Optional<Usuario> usuarioExistente = this.repository.findByNumeroDocumento(data.numeroDocumento());
            if(usuarioExistente.isPresent()) {
                // Obtém o tipo de documento do usuário existente
                TipoDocumento tipoDocExistente = usuarioExistente.get().getTipoDocumento();

                // Mensagem de erro específica
                String mensagemErro = tipoDocExistente == TipoDocumento.CPF
                        ? "CPF já cadastrado"
                        : "CNPJ já cadastrado";

                return ResponseEntity.badRequest().body(mensagemErro);
            }

            // Criptografa a senha
            String encryptedPassword = new BCryptPasswordEncoder().encode(data.senha_hash());

            // Cria novo usuário
            Usuario novoUsuario = new Usuario(
                    data.nome(),
                    data.email(),
                    encryptedPassword,
                    data.tipoConta(),
                    data.tipoDocumento(),
                    data.numeroDocumento()
            );

            // Salva no banco de dados
            this.repository.save(novoUsuario);

            return ResponseEntity.ok().build();

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Ocorreu um erro durante o registro: " + e.getMessage());
        }
    }
}