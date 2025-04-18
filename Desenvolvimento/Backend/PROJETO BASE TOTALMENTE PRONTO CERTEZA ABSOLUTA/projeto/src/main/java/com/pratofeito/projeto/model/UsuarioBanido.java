package com.pratofeito.projeto.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "usuario_banido")
public class UsuarioBanido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "numero_documento", nullable = false, length = 20)
    private String numeroDocumento;

    @Column(name = "email", nullable = false, length = 60)
    private String email;

    @Column(name = "motivo", nullable = false)
    private String motivo;

    @Column(name = "data_banimento", nullable = false)
    private LocalDate dataBanimento;

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private Usuario admin;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    public UsuarioBanido() {
    }

    public UsuarioBanido(String numeroDocumento, String email, String motivo, LocalDate dataBanimento, Usuario admin, Usuario usuario) {
        this.numeroDocumento = numeroDocumento;
        this.email = email;
        this.motivo = motivo;
        this.dataBanimento = dataBanimento;
        this.admin = admin;
        this.usuario = usuario;
    }

    // Getters e Setters (gerar para todos os campos)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNumeroDocumento() {
        return numeroDocumento;
    }

    public void setNumeroDocumento(String numeroDocumento) {
        this.numeroDocumento = numeroDocumento;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public LocalDate getDataBanimento() {
        return dataBanimento;
    }

    public void setDataBanimento(LocalDate dataBanimento) {
        this.dataBanimento = dataBanimento;
    }

    public Usuario getAdmin() {
        return admin;
    }

    public void setAdmin(Usuario admin) {
        this.admin = admin;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}