package com.apoio_comunitario.service; // Pacote onde a classe está localizada

import com.apoio_comunitario.model.Usuario; // Importa a classe Usuario, que representa o modelo de usuário
import com.apoio_comunitario.repository.UsuarioRepository; // Importa o repositório de usuários
import org.springframework.beans.factory.annotation.Autowired; // Importa a anotação para injeção de dependência
import org.springframework.stereotype.Service; // Importa a anotação para definir um serviço
import java.util.List; // Importa a classe List para trabalhar com listas de usuários

@Service // Indica que esta classe é um serviço do Spring
public class UsuarioService {

    @Autowired // Permite que o Spring injete a instância do UsuarioRepository automaticamente
    private UsuarioRepository usuarioRepository; // Declaração do repositório de usuários

    // Método para listar todos os usuários
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll(); // Chama o método do repositório para obter todos os usuários
    }

    // Método para salvar um novo usuário
    public Usuario salvarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario); // Chama o método do repositório para salvar o usuário no banco de dados
    }

    // Você pode adicionar mais métodos aqui para operações adicionais no serviço de usuários
}