package com.apoio_comunitario.service;

import com.apoio_comunitario.model.Ocorrencia;
import com.apoio_comunitario.repository.OcorrenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OcorrenciaService {
    @Autowired
    private OcorrenciaRepository ocorrenciaRepository;

    public List<Ocorrencia> listarOcorrencias() {
        return ocorrenciaRepository.findAll();
    }

    public Ocorrencia salvarOcorrencia(Ocorrencia ocorrencia) {
        return ocorrenciaRepository.save(ocorrencia);
    }
    //dps coloco mais algo tbm
}