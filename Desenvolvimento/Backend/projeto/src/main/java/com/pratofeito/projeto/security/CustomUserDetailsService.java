package com.pratofeito.projeto.security;

import com.pratofeito.projeto.model.Usuario;
import com.pratofeito.projeto.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Validação básica do email
        if (email == null || email.trim().isEmpty()) {
            throw new UsernameNotFoundException("Email não pode ser vazio");
        }

        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);

        Usuario usuario = usuarioOptional.orElseThrow(() ->
                new UsernameNotFoundException("Usuário não encontrado com o email: " + email)
        );

        // Converte as roles/permissões do seu usuário para GrantedAuthority
        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + usuario.getAuthorities()) // Supondo que getRole() retorna USER, ADMIN etc.
        );

        return new User(
                usuario.getEmail(),
                usuario.getPassword(),
                authorities
        );
    }
}