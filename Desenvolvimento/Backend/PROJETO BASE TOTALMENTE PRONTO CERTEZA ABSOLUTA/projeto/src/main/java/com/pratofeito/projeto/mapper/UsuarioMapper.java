package com.pratofeito.projeto.mapper;

import com.pratofeito.projeto.dto.usuario.UsuarioCreateDTO;
import com.pratofeito.projeto.dto.usuario.UsuarioResponseDTO;
import com.pratofeito.projeto.model.Usuario;

/**
 * Classe responsável por mapear objetos entre DTOs (Data Transfer Objects) e a entidade Usuario.
 * Facilita a conversão de dados entre a camada de apresentação (DTOs) e a camada de domínio (entidades).
 */
public class UsuarioMapper {

    /**
     * Converte um objeto UsuarioCreateDTO em uma entidade Usuario.
     * Este método é útil para criar um novo usuário a partir dos dados fornecidos pelo cliente.
     *
     * param usuarioCreateDTO DTO contendo os dados para criação de um usuário.
     * return Entidade Usuario populada com os dados do DTO.
     */
    public static Usuario toEntity(UsuarioCreateDTO usuarioCreateDTO) {
        // Cria uma nova instância de Usuario com os dados do DTO
        Usuario usuario = new Usuario(
                usuarioCreateDTO.getNome(),       // Nome do usuário
                usuarioCreateDTO.getEmail(),       // Email do usuário
                usuarioCreateDTO.getSenha(),       // Senha do usuário
                usuarioCreateDTO.getTipo_conta(),  // Tipo de conta do usuário (enum)
                usuarioCreateDTO.getTipo_documento(), // Tipo de documento do usuário (enum)
                usuarioCreateDTO.getNumero_documento() // Número do documento do usuário
        );

        return usuario; // Retorna a entidade Usuario criada
    }

    /**
     * Converte uma entidade Usuario em um objeto UsuarioResponseDTO.
     * Este método é útil para retornar dados do usuário para o cliente, expondo apenas as informações necessárias.
     *
     * param usuario Entidade Usuario a ser convertida.
     * return DTO contendo os dados do usuário para resposta.
     */
    public static UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        // Cria uma nova instância de UsuarioResponseDTO
        UsuarioResponseDTO dto = new UsuarioResponseDTO();

        // Popula o DTO com os dados da entidade Usuario
        dto.setId(usuario.getId());           // ID do usuário
        dto.setNome(usuario.getNome());        // Nome do usuário
        dto.setEmail(usuario.getEmail());      // Email do usuário
        dto.setTipo_conta(usuario.getTipoConta()); // Tipo de conta do usuário (enum)

        return dto; // Retorna o DTO populado
    }
}