package com.pratofeito.projeto.controller;

import com.pratofeito.projeto.dto.ocorrencia.OcorrenciaResponseDTO;
import com.pratofeito.projeto.dto.ocorrencia.OcorrenciaUpdateDTO;
import com.pratofeito.projeto.model.Ocorrencia;
import com.pratofeito.projeto.model.Usuario;
import com.pratofeito.projeto.model.enums.TipoOcorrencia;
import com.pratofeito.projeto.repository.UsuarioRepository;
import com.pratofeito.projeto.service.OcorrenciaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DateTimeException;
import java.time.LocalDate;
import java.util.List;
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
     * @see Ocorrencia
     */
    @CrossOrigin("*")
    @GetMapping("/listar")
    public List<Ocorrencia> listarOcorrencias() {
        return ocorrenciaService.listarOcorrencias();
    }

    /**
     * Recupera ocorrências criadas em uma data específica.
     *
     * @param data Data no formato YYYY-MM-DD (ex: 2024-01-15)
     * @return ResponseEntity contendo lista de DTOs das ocorrências da data especificada
     *         e status HTTP 200, ou status 400 se a data for inválida
     * @see OcorrenciaResponseDTO
     */
    @CrossOrigin("*")
    @GetMapping("/por-data")
    public ResponseEntity<List<OcorrenciaResponseDTO>> listarPorData(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {

        try {
            List<Ocorrencia> ocorrencias = ocorrenciaService.listarPorData(data);
            List<OcorrenciaResponseDTO> dtos = ocorrencias.stream()
                    .map(OcorrenciaResponseDTO::new)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (DateTimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }



    @GetMapping("/{id}")
    public ResponseEntity<OcorrenciaResponseDTO> buscarPorId(@PathVariable Long id) {
        try {
            Ocorrencia ocorrencia = ocorrenciaService.buscarPorId(id);
            return ResponseEntity.ok(new OcorrenciaResponseDTO(ocorrencia));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Cria uma nova ocorrência no sistema.
     *
     * @param ocorrencia Objeto Ocorrencia contendo os dados da nova ocorrência
     * @return ResponseEntity com a ocorrência criada (em DTO) e status HTTP 200
     * @throws RuntimeException Se o usuário associado não for encontrado
     * @see OcorrenciaResponseDTO
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
     * @return ResponseEntity com a ocorrência atualizada e status HTTP 200,
     *         ou status 404 se a ocorrência não for encontrada
     * @see OcorrenciaUpdateDTO
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
     * @return ResponseEntity com status HTTP 200 se bem-sucedido,
     *         ou status 404 se a ocorrência não for encontrada
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
     *         e status HTTP 200
     * @see OcorrenciaResponseDTO
     */
    @CrossOrigin("*")
    @GetMapping("/recentes")
    public ResponseEntity<List<OcorrenciaResponseDTO>> listarRecentes() {
        List<Ocorrencia> recentes = ocorrenciaService.listarRecentes();
        List<OcorrenciaResponseDTO> dtos = recentes.stream()
                .map(OcorrenciaResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * Recupera ocorrências por tipo específico (DOACAO ou PEDIDO).
     *
     * @param tipo Tipo da ocorrência para filtrar (DOACAO ou PEDIDO)
     * @return ResponseEntity contendo lista de DTOs das ocorrências do tipo especificado
     *         e status HTTP 200, ou status 404 se nenhuma ocorrência for encontrada
     * @see OcorrenciaResponseDTO
     */
    @CrossOrigin("*")
    @GetMapping("/por-tipo")
    public ResponseEntity<List<OcorrenciaResponseDTO>> listarPorTipo(
            @RequestParam TipoOcorrencia tipo) {

        List<Ocorrencia> ocorrencias = ocorrenciaService.listarPorTipo(tipo);

        if (ocorrencias.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<OcorrenciaResponseDTO> dtos = ocorrencias.stream()
                .map(OcorrenciaResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
}