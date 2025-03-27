package com.apoio_comunitario.service;

import com.apoio_comunitario.model.Avaliacao;
import com.apoio_comunitario.repository.AvaliacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AvaliacaoService {
    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    public List<Avaliacao> listarAvaliacoes() {
        return avaliacaoRepository.findAll();
    }

    public Avaliacao salvarAvaliacao(Avaliacao avaliacao) {
        return avaliacaoRepository.save(avaliacao);
    }
    //dps coloco mais algo tbm
}