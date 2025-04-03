package com.pratofeito.projeto.service;

import com.pratofeito.projeto.dto.AuthenticationDTO;
import com.pratofeito.projeto.dto.LoginResponseDTO;
import com.pratofeito.projeto.dto.RegisterDTO;
import com.pratofeito.projeto.model.Usuario;
import com.pratofeito.projeto.model.enums.TipoDocumento;
import com.pratofeito.projeto.repository.UsuarioRepository;
import com.pratofeito.projeto.security.TokenService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final TokenService tokenService;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(AuthenticationManager authenticationManager,
                       UsuarioRepository usuarioRepository,
                       TokenService tokenService) {
        this.authenticationManager = authenticationManager;
        this.usuarioRepository = usuarioRepository;
        this.tokenService = tokenService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public LoginResponseDTO login(AuthenticationDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.senha_hash());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        var usuario = (Usuario) auth.getPrincipal();
        var token = tokenService.generateToken(usuario);
        return new LoginResponseDTO(token);
    }

    public void register(RegisterDTO data) {
        validarRegistro(data);

        Usuario novoUsuario = criarUsuario(data);
        usuarioRepository.save(novoUsuario);
    }

    private void validarRegistro(RegisterDTO data) {
        if(usuarioRepository.findByEmail(data.email()).isPresent()) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        Optional<Usuario> usuarioExistente = usuarioRepository.findByNumeroDocumento(data.numeroDocumento());
        if(usuarioExistente.isPresent()) {
            TipoDocumento tipoDocExistente = usuarioExistente.get().getTipoDocumento();
            String mensagemErro = tipoDocExistente == TipoDocumento.CPF
                    ? "CPF já cadastrado"
                    : "CNPJ já cadastrado";
            throw new IllegalArgumentException(mensagemErro);
        }
    }

    private Usuario criarUsuario(RegisterDTO data) {
        String encryptedPassword = passwordEncoder.encode(data.senha_hash());

        return new Usuario(
                data.nome(),
                data.email(),
                encryptedPassword,
                data.tipoConta(),
                data.tipoDocumento(),
                data.numeroDocumento()
        );
    }
}