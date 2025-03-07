package com.pratofeito.projeto.security;

import com.pratofeito.projeto.model.Usuario;
import com.pratofeito.projeto.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Serviço personalizado para carregar detalhes do usuário durante a autenticação.
 * Implementa a interface UserDetailsService do Spring Security para integrar a autenticação
 * com a entidade Usuario do sistema.
 */
@Service // Indica que esta classe é um serviço gerenciado pelo Spring
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired // Injeção de dependência automática do repositório UsuarioRepository
    private UsuarioRepository usuarioRepository;

    /**
     * Carrega os detalhes do usuário com base no email.
     * Este método é chamado pelo Spring Security durante o processo de autenticação.
     *
     * @param email Email do usuário a ser carregado.
     * @return UserDetails contendo informações do usuário.
     * @throws UsernameNotFoundException Se o usuário não for encontrado.
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Busca o usuário no banco de dados pelo email
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);

        // Lança uma exceção se o usuário não for encontrado
        Usuario usuario = usuarioOptional.orElseThrow(() ->
                new UsernameNotFoundException("Usuário não encontrado: " + email)
        );

        // Retorna o objeto Usuario, que implementa UserDetails
        return usuario;
    }
}