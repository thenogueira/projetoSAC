package com.pratofeito.projeto.service;

import com.pratofeito.projeto.dto.ComentarioDTO;
import com.pratofeito.projeto.model.Comentario;
import com.pratofeito.projeto.model.Ocorrencia;
import com.pratofeito.projeto.model.Usuario;
import com.pratofeito.projeto.repository.ComentarioRepository;
import com.pratofeito.projeto.repository.OcorrenciaRepository;
import com.pratofeito.projeto.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ComentarioService {

    @Autowired
    private ComentarioRepository comentarioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private OcorrenciaRepository ocorrenciaRepository;

    public Comentario criarComentario(ComentarioDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        Ocorrencia ocorrencia = ocorrenciaRepository.findById(dto.getOcorrenciaId())
                .orElseThrow(() -> new RuntimeException("Ocorrência não encontrada"));

        Comentario comentario = new Comentario();
        comentario.setTexto(dto.getTexto());
        comentario.setUsuario(usuario);
        comentario.setOcorrencia(ocorrencia);

        return comentarioRepository.save(comentario);
    }
}
