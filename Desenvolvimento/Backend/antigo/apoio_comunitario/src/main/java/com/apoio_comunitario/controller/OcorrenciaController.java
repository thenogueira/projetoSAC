package com.apoio_comunitario.controller;

import com.apoio_comunitario.model.Ocorrencia;
import com.apoio_comunitario.service.OcorrenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ocorrencias")
public class OcorrenciaController {
    @Autowired
    private OcorrenciaService ocorrenciaService;

    @GetMapping
    public List<Ocorrencia> listarOcorrencias() {
        return ocorrenciaService.listarOcorrencias();
    }

    @PostMapping
    public Ocorrencia criarOcorrencia(@RequestBody Ocorrencia ocorrencia) {
        return ocorrenciaService.salvarOcorrencia(ocorrencia);
    }

    // endpontus
}