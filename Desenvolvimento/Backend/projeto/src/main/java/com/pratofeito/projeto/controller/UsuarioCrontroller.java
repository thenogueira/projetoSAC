package com.pratofeito.projeto.controller;

import com.pratofeito.projeto.dto.usuario.UsuarioCreateDTO;
import com.pratofeito.projeto.dto.usuario.UsuarioResponseDTO;
import com.pratofeito.projeto.mapper.UsuarioMapper;
import com.pratofeito.projeto.model.Usuario;
import com.pratofeito.projeto.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador responsável por gerenciar as requisições relacionadas à entidade Usuario.
 * Este controlador expõe endpoints para listar e criar usuários.
 */
@RestController // Indica que esta classe é um controlador REST
@CrossOrigin("*") // Permite requisições de qualquer origem (CORS)
@RequestMapping("/usuarios") // Define o caminho base para os endpoints deste controlador
public class UsuarioCrontroller {

    @Autowired // Injeção de dependência automática do serviço UsuarioService
    private UsuarioService usuarioService;

    private UsuarioResponseDTO usuarioResponseDTO;
    private UsuarioCreateDTO usuarioCreateDTO;

    /**
     * Endpoint para listar todos os usuários cadastrados no sistema.
     *
     * return Uma lista de objetos Usuario.
     */
    @GetMapping("/listar")
    public List<UsuarioResponseDTO> listarUsuarios() {
        List<Usuario> usuarios = usuarioService.listarUsuarios();

        // Converta cada Usuario na lista para UsuarioResponseDTO
        return usuarios.stream()
                .map(UsuarioMapper::toResponseDTO) // Chama o método para cada elemento
                .collect(Collectors.toList());
    }

    /**
     * Endpoint para criar um novo usuário.
     *
     * param usuario Objeto Usuario recebido no corpo da requisição.
     * return O usuário criado e salvo no banco de dados.
     */
    @PostMapping("/criar")
    public UsuarioResponseDTO criarUsuario(@RequestBody UsuarioCreateDTO usuarioCreateDTO) {
        // Converte o DTO para a entidade
        Usuario usuario = UsuarioMapper.toEntity(usuarioCreateDTO);

        // Salva o usuário (criptografando a senha, se necessário)
        Usuario usuarioSalvo = usuarioService.salvarUsuario(usuario);

        // Converte a entidade salva para DTO de resposta
        return UsuarioMapper.toResponseDTO(usuarioSalvo);
    }
}