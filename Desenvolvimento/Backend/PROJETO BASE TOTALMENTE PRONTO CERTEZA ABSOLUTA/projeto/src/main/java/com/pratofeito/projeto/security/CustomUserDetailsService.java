package com.pratofeito.projeto.security;

import com.pratofeito.projeto.model.Usuario;
import com.pratofeito.projeto.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

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

        // Busca o usuário no banco
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com o email: " + email));

        // Retorna o próprio Usuario, que implementa UserDetails
        return usuario;
    }
}