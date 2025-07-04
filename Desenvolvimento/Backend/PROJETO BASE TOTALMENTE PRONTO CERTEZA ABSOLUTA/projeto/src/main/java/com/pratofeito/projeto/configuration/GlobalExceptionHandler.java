package com.pratofeito.projeto.configuration;

import com.pratofeito.projeto.exception.UsuarioBanidoException;
import com.pratofeito.projeto.exception.ErroResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.ResponseStatusException;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Classe responsável pelo tratamento global de exceções na aplicação.
 * Utiliza a anotação @ControllerAdvice para interceptar exceções lançadas em controladores
 * e retornar respostas apropriadas ao cliente.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Trata exceções de violação de integridade de dados.
     *
     * @param ex A exceção de violação de integridade de dados.
     * @param request A requisição que causou a exceção.
     * @return Uma resposta com o status 409 (CONFLICT) e detalhes do erro.
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleDataIntegrityViolation(DataIntegrityViolationException ex, WebRequest request) {
        String errorMessage = "Erro de integridade de dados";
        HttpStatus status = HttpStatus.CONFLICT; // Status básico para conflitos de integridade.

        if (ex.getCause() instanceof SQLIntegrityConstraintViolationException sqlEx &&
                sqlEx.getMessage().contains("usuario.email")) {
            errorMessage = "O e-mail informado já está em uso por outro usuário";
        } // Verifica se a causa da exceção é uma violação de integridade de e-mail.

        ErroResponse response = new ErroResponse(
                status.value(),
                status.getReasonPhrase(),
                errorMessage,
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(response, status); // Retorna a resposta normal
    }

    /**
     * Trata exceções de status HTTP.
     *
     * @param ex A exceção de status HTTP.
     * @param request A requisição que causou a exceção.
     * @return Uma resposta com o status correspondente e detalhes do erro.
     */
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
    } // Trata exceções de status HTTP.

    /**
     * Trata exceções quando um usuário está banido.
     *
     * @param ex A exceção de usuário banido.
     * @param request A requisição que causou a exceção.
     * @return Uma resposta com o status 403 (FORBIDDEN) e detalhes do erro.
     */
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
    } // Resposta caso o usuário esteja banido.

    /**
     * Trata exceções genéricas que não foram capturadas por outros manipuladores.
     *
     * @param ex A exceção que foi lançada.
     * @param request A requisição que causou a exceção.
     * @return Uma resposta com o status 500 (INTERNAL_SERVER_ERROR) e detalhes do erro.
     */
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
    } // Trata qualquer erro não especificado.

    /**
     * Trata exceções de credenciais inválidas.
     *
     * @param ex A exceção de credenciais inválidas.
     * @param request A requisição que causou a exceção.
     * @return Uma resposta com o status 401 (UNAUTHORIZED) e detalhes do erro.
     */
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
    } // Trata erros de credenciais, como senhas ou e-mails incorretos.

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex,
            WebRequest request) {

        // Coleta todos os erros de validação agrupados por campo
        Map<String, List<String>> errors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.groupingBy(
                        FieldError::getField,
                        Collectors.mapping(FieldError::getDefaultMessage, Collectors.toList())
                ));

        // Cria a resposta de erro usando sua classe existente
        ErroResponse erroResponse = new ErroResponse(
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                "Erro de validação nos dados enviados",
                request.getDescription(false),
                errors
        );

        return ResponseEntity.badRequest().body(erroResponse);
    }

}
