package com.pratofeito.projeto.security;

import com.pratofeito.projeto.model.Usuario;
import com.pratofeito.projeto.repository.UsuarioRepository;
import com.pratofeito.projeto.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Serviço personalizado para carregar detalhes do usuário durante a autenticação.
 * Implementa a interface UserDetailsService do Spring Security para integrar a autenticação
 * com a entidade Usuario do sistema.
 */
@Service // Indica que esta classe é um serviço gerenciado pelo Spring
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired // Injeção de dependência automática do repositório UsuarioRepository
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioService usuarioService;

    /**
     * Carrega os detalhes do usuário com base no nome de usuário (nome).
     * Este método é chamado pelo Spring Security durante o processo de autenticação.
     *
     * param nome Nome do usuário a ser carregado.
     * return UserDetails contendo informações do usuário.
     * throws UsernameNotFoundException Se o usuário não for encontrado.
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Busca o usuário no banco de dados pelo nome
        Usuario usuario = usuarioRepository.findByEmail(email);

        // Lança uma exceção se o usuário não for encontrado
        if (usuario == null) {
            throw new UsernameNotFoundException("Usuário não encontrado: " + email);
        }

        // Constrói um objeto UserDetails com base nas informações do usuário
        return new org.springframework.security.core.userdetails.User(
                usuario.getEmail(),
                usuario.getSenha_hash(),
                usuarioService.getAuthorities()
        );  // Constrói o objeto UserDetails
    }
}