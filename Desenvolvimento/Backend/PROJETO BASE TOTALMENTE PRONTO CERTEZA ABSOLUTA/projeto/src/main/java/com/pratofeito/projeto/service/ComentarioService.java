package com.pratofeito.projeto.service;

import com.pratofeito.projeto.dto.ComentarioDTO;
import com.pratofeito.projeto.model.Comentario;
import com.pratofeito.projeto.model.Usuario;
import com.pratofeito.projeto.repository.ComentarioRepository;
import com.pratofeito.projeto.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ComentarioService {

    @Autowired
    private ComentarioRepository comentarioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Comentario criarComentario(ComentarioDTO dto) {
        // Buscar o usuário que está comentando (autor)
        Usuario usuario = usuarioRepository.findById((long) dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Buscar o usuário alvo (sobre quem é o comentário)
        Usuario usuarioAlvo = usuarioRepository.findById((long) dto.getUsuarioAlvoId())
                .orElseThrow(() -> new RuntimeException("Usuário alvo não encontrado"));

        // Validação opcional: evitar auto-comentário
        if (usuario.getId() == usuarioAlvo.getId()) {
            throw new RuntimeException("Um usuário não pode comentar sobre si mesmo");
        }

        Comentario comentario = new Comentario();
        comentario.setTexto(dto.getTexto());
        comentario.setUsuario(usuario);
        comentario.setUsuarioAlvo(usuarioAlvo);

        return comentarioRepository.save(comentario);
    }
}