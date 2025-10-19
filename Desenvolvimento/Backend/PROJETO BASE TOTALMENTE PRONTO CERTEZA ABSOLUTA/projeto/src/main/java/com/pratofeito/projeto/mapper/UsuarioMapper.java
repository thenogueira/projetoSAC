package com.pratofeito.projeto.mapper;

import com.pratofeito.projeto.dto.usuario.UsuarioCreateDTO;
import com.pratofeito.projeto.dto.usuario.UsuarioResponseDTO;
import com.pratofeito.projeto.dto.usuario.UsuarioUpdateDTO;
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
    public static Usuario toEntity(UsuarioCreateDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha_hash(dto.getSenha()); // Será criptografado no service
        usuario.setTipoDocumento(dto.getTipoDocumento());
        usuario.setNumeroDocumento(dto.getNumeroDocumento());
        // tipoConta e statusConta serão definidos no service
        return usuario;
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

    public static Usuario toEntity(UsuarioUpdateDTO usuarioUpdateDTO) {
        if (usuarioUpdateDTO == null) {
            return null;
        }

        Usuario usuario = new Usuario();
        usuario.setNome(usuarioUpdateDTO.getNome());
        usuario.setEmail(usuarioUpdateDTO.getEmail());
        // Não atualizamos ID, senha ou outros campos sensíveis aqui
        return usuario;
    }
}