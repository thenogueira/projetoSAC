package com.pratofeito.projeto.controller;

import com.pratofeito.projeto.dto.ComentarioDTO;
import com.pratofeito.projeto.model.Comentario;
import com.pratofeito.projeto.repository.ComentarioRepository;
import com.pratofeito.projeto.service.ComentarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/comentarios")
public class ComentarioController {

    @Autowired
    private ComentarioService comentarioService;
    @Autowired
    private ComentarioRepository comentarioRepository;

    @PostMapping
    public ResponseEntity<Comentario> criar(@RequestBody @Valid ComentarioDTO dto) {
        Comentario comentario = comentarioService.criarComentario(dto);
        return ResponseEntity.ok(comentario);
    }

    @GetMapping
    public List<Comentario> listarComentarios() {
        return comentarioRepository.findAll();
    }

    //Buscar comentários sobre um usuário específico
    @GetMapping("/usuario/{usuarioAlvoId}")
    public ResponseEntity<List<Comentario>> listarComentariosPorUsuarioAlvo(
            @PathVariable int usuarioAlvoId) {
        List<Comentario> comentarios = comentarioRepository.findByUsuarioAlvoId(usuarioAlvoId);
        return ResponseEntity.ok(comentarios);
    }
    //Buscar comentários feitos por um usuário
    @GetMapping("/autor/{usuarioId}")
    public ResponseEntity<List<Comentario>> listarComentariosPorAutor(
            @PathVariable int usuarioId) {
        List<Comentario> comentarios = comentarioRepository.findByUsuarioId(usuarioId);
        return ResponseEntity.ok(comentarios);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Comentario> atualizarComentario(
            @PathVariable int id,
            @RequestBody ComentarioDTO comentarioRequest) {

        Optional<Comentario> optionalComentario = comentarioRepository.findById(id);

        if (optionalComentario.isEmpty()) {
            return ResponseEntity.notFound().build();
        } // trata a exceção do pedido de comentário. À buscar pelo comentário de um usuário, é possivel que o mesmo não tenha comentarios.

        Comentario comentario = optionalComentario.get();
        comentario.setTexto(comentarioRequest.getTexto());
        comentario.setDataAtualizacao(LocalDateTime.now());

        comentarioRepository.save(comentario);

        return ResponseEntity.ok(comentario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirComentario(@PathVariable int id) {
        if (!comentarioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        } // acima, se a busca por comentarios byid não encontrar sucesso, constroi uma mensagem

        comentarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
