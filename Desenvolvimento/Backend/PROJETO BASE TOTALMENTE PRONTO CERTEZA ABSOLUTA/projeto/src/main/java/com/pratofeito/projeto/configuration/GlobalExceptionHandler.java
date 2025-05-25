package com.pratofeito.projeto.configuration;

import com.pratofeito.projeto.exception.UsuarioBanidoException;
import com.pratofeito.projeto.exception.ErroResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.ResponseStatusException;

import java.sql.SQLIntegrityConstraintViolationException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleDataIntegrityViolation(DataIntegrityViolationException ex, WebRequest request) {
        String errorMessage = "Erro de integridade de dados";
        HttpStatus status = HttpStatus.CONFLICT; // basico,o E.H trata de exceções, e nesse caso, unicidade.

        if (ex.getCause() instanceof SQLIntegrityConstraintViolationException sqlEx &&
                sqlEx.getMessage().contains("usuario.email")) {
            errorMessage = "O e-mail informado já está em uso por outro usuário";
        } // pega a ex.getCause que é a causa da excecao e chega se tem email no CDE.

        ErroResponse response = new ErroResponse(
                status.value(),
                status.getReasonPhrase(),
                errorMessage,
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(response, status); // retorna a resposta normal
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Object> handleResponseStatusException(ResponseStatusException ex, WebRequest request) {
        HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());

        ErroResponse response = new ErroResponse(
                status.value(),
                status.getReasonPhrase(),
                ex.getReason(),
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(response, status);
    } // esse trata das excecoes de status

    @ExceptionHandler(UsuarioBanidoException.class)
    public ResponseEntity<Object> handleUsuarioBanido(UsuarioBanidoException ex, WebRequest request) {
        HttpStatus status = HttpStatus.FORBIDDEN;

        ErroResponse response = new ErroResponse(
                status.value(),
                status.getReasonPhrase(),
                ex.getMessage(),
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(response, status);
    } // resposta caso usuario esteja incluido no banimento

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGlobalExceptions(Exception ex, WebRequest request) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        ErroResponse response = new ErroResponse(
                status.value(),
                status.getReasonPhrase(),
                "Ocorreu um erro interno no servidor",
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(response, status);
    } // trata qualquer erro não setado. Escape.

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Object> handleBadCredentials(BadCredentialsException ex, WebRequest request) {
        HttpStatus status = HttpStatus.UNAUTHORIZED;
        ErroResponse response = new ErroResponse(
                status.value(),
                status.getReasonPhrase(),
                "Senha ou email incorretos",
                request.getDescription(false).replace("uri=", "")
        );
        return new ResponseEntity<>(response, status);
    } // erro de credencial, chamado de "match"
}
