package com.pratofeito.projeto.controller;

import com.pratofeito.projeto.dto.ocorrencia.OcorrenciaResponseDTO;
import com.pratofeito.projeto.dto.ocorrencia.OcorrenciaUpdateDTO;
import com.pratofeito.projeto.model.Ocorrencia;
import com.pratofeito.projeto.model.Usuario;
import com.pratofeito.projeto.repository.UsuarioRepository;
import com.pratofeito.projeto.service.OcorrenciaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Controlador REST para operações relacionadas a ocorrências.
 * Expõe endpoints para CRUD de ocorrências e consultas específicas.
 * Todos os endpoints são acessíveis sob o caminho base '/ocorrencias'.
 */

@RestController
@CrossOrigin("*")
@RequestMapping("/ocorrencias")
public class OcorrenciaController {

    @Autowired
    private OcorrenciaService ocorrenciaService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Recupera todas as ocorrências cadastradas no sistema.
     *
     * @return Lista de todas as ocorrências em formato JSON
     */
    @GetMapping("/listar")
    public List<Ocorrencia> listarOcorrencias() {
        return ocorrenciaService.listarOcorrencias();
    }

    /**
     * Recupera uma ocorrência específica pelo seu ID.
     *
     * @param id ID da ocorrência
     * @return ResponseEntity com a ocorrência encontrada ou 404 se não existir
     */
    @GetMapping("/{id}")
    public ResponseEntity<Ocorrencia> getOcorrenciaById(@PathVariable Long id) {
        Optional<Ocorrencia> ocorrencia = ocorrenciaService.buscarPorId(id);
        return ocorrencia.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Cria uma nova ocorrência no sistema.
     *
     * @param ocorrencia Objeto Ocorrencia contendo os dados da nova ocorrência
     * @return ResponseEntity com a ocorrência criada (em DTO) e status HTTP 200
     */
    @PostMapping("/criar")
    public ResponseEntity<OcorrenciaResponseDTO> criarOcorrencia(@Valid @RequestBody Ocorrencia ocorrencia) {
        Usuario usuario = usuarioRepository.findById(ocorrencia.getUsuario().getId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        ocorrencia.setUsuario(usuario);

        Ocorrencia salva = ocorrenciaService.salvarOcorrencia(ocorrencia);

        return ResponseEntity.ok(new OcorrenciaResponseDTO(salva));
    }

    /**
     * Atualiza uma ocorrência existente.
     *
     * @param id ID da ocorrência a ser atualizada
     * @param ocorrenciaDTO DTO com os campos atualizáveis da ocorrência
     * @return ResponseEntity com a ocorrência atualizada ou 404 se não encontrada
     */
    @PutMapping("/editar/{id}")
    public ResponseEntity<Ocorrencia> editarOcorrencia(
            @PathVariable Long id,
            @Valid @RequestBody OcorrenciaUpdateDTO ocorrenciaDTO) {

        try {
            Ocorrencia ocorrenciaEditada = ocorrenciaService.editarOcorrencia(id, ocorrenciaDTO);
            return ResponseEntity.ok(ocorrenciaEditada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Remove uma ocorrência do sistema.
     *
     * @param id ID da ocorrência a ser removida
     * @return ResponseEntity com status HTTP 200 se bem-sucedido ou 404 se não encontrada
     */
    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Void> deletarOcorrencia(@PathVariable Long id) {
        try {
            ocorrenciaService.deletarOcorrencia(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Recupera as 5 ocorrências mais recentes, ordenadas por data de criação decrescente.
     *
     * @return ResponseEntity contendo lista de DTOs das ocorrências recentes
     */
    @GetMapping("/recentes")
    public ResponseEntity<List<OcorrenciaResponseDTO>> listarRecentes() {
        List<Ocorrencia> recentes = ocorrenciaService.listarRecentes();
        List<OcorrenciaResponseDTO> dtos = recentes.stream()
                .map(OcorrenciaResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}