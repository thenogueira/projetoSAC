package com.apoio_comunitario.security;

import com.apoio_comunitario.model.Usuario; // Importa a classe Usuario, que representa o modelo de usuário
import com.apoio_comunitario.repository.UsuarioRepository; // Importa o repositório de usuários
import org.springframework.beans.factory.annotation.Autowired; // Importa a anotação para injeção de dependência
import org.springframework.security.core.userdetails.User; // Importa a classe User para criar detalhes do usuário
import org.springframework.security.core.userdetails.UserDetails; // Importa a interface UserDetails
import org.springframework.security.core.userdetails.UserDetailsService; // Importa a interface UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException; // Importa a exceção para usuário não encontrado
import org.springframework.stereotype.Service; // Importa a anotação para definir um serviço
@Service // Indica que esta classe é um serviço do Spring
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired // Permite que o Spring injete a instância do UsuarioRepository automaticamente
    private UsuarioRepository usuarioRepository;

    @Override // Método que carrega os detalhes do usuário com base no nome de usuário
    public UserDetails loadUserByUsername(String nome) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByNome(nome); // Busca o usuário pelo nome
        if (usuario == null) {
            throw new UsernameNotFoundException("Usuário não encontrado: " + nome);
        }
        // Retorna os detalhes do usuário, incluindo nome, senha e autoridades
        return User.withUsername(usuario.getNome())
                .password(usuario.getSenha_hash())
                .authorities(usuario.getAuthorities())
                .build(); // Constrói e retorna o objeto UserDetails
    }
    }
