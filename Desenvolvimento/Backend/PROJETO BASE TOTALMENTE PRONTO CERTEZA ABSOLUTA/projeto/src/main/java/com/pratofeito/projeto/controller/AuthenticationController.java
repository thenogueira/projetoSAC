package com.pratofeito.projeto.controller;

import com.pratofeito.projeto.dto.AuthenticationDTO;
import com.pratofeito.projeto.dto.LoginResponseDTO;
import com.pratofeito.projeto.dto.RegisterDTO;
import com.pratofeito.projeto.model.Usuario;
import com.pratofeito.projeto.model.enums.TipoConta;
import com.pratofeito.projeto.repository.UsuarioRepository;
import com.pratofeito.projeto.security.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

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

        // Cast para Usuario em vez de User
        var usuario = (Usuario) auth.getPrincipal();
        var token = tokenService.generateToken(usuario);

        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegisterDTO data){
        if(this.repository.findByEmail(data.email()).isPresent()) return ResponseEntity.badRequest().build();

        String encryptePassword = new BCryptPasswordEncoder().encode(data.senha_hash());
        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(data.nome());
        novoUsuario.setEmail(data.email());
        novoUsuario.setSenha_hash(encryptePassword);
        novoUsuario.setTipo_conta(data.tipoConta());
        novoUsuario.setTipo_documento(data.tipoDocumento());
        novoUsuario.setNumero_documento(data.numeroDocumento());

        this.repository.save(novoUsuario);

        return ResponseEntity.ok().build();

    }
}
