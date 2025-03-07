package com.pratofeito.projeto.mapper;

import com.pratofeito.projeto.dto.usuario.UsuarioCreateDTO;
import com.pratofeito.projeto.dto.usuario.UsuarioResponseDTO;
import com.pratofeito.projeto.model.Usuario;
import com.pratofeito.projeto.model.enums.TipoConta;
import com.pratofeito.projeto.model.enums.TipoDocumento;

public class UsuarioMapper {

    public static Usuario toEntity(UsuarioCreateDTO usuarioCreateDTO) {
        Usuario usuario = new Usuario();
        usuario.setNome(usuarioCreateDTO.getNome());
        usuario.setEmail(usuarioCreateDTO.getEmail());
        usuario.setSenha_hash(usuarioCreateDTO.getSenha()); // Aqui você pode criptografar a senha
        usuario.setTipo_documento(usuarioCreateDTO.getTipo_documento());
        usuario.setNumero_documento(usuarioCreateDTO.getNumero_documento());
        usuario.setTipo_conta(usuarioCreateDTO.getTipo_conta());
        return usuario;
    }

    public static UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());
        dto.setTipo_conta(usuario.getTipo_conta());
        return dto;
    }
}