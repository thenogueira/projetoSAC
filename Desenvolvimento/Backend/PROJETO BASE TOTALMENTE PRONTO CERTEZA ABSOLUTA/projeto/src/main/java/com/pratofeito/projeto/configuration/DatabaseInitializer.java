package com.pratofeito.projeto.configuration;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class DatabaseInitializer implements ApplicationRunner {

    private final DataSource dataSource;
    private final String relativeScriptPath = "Dados/projetoSac.sql";

    public DatabaseInitializer(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        System.out.println("Verificando disponibilidade do banco...");
        if (!isDatabaseAvailable()) {
            System.out.println("Banco não disponível. Iniciando inicialização...");
            initializeDatabase();
        } else {
            System.out.println("Banco já está disponível. Pulando inicialização.");
        }
    }
    private boolean isDatabaseAvailable() {
        try (Connection conn = dataSource.getConnection();
             ResultSet rs = conn.getMetaData().getTables(null, null, "usuario", null)) {

            return rs.next(); // true se a tabela existe
        } catch (SQLException e) {
            System.err.println("Erro ao verificar banco: " + e.getMessage());
            return false;
        }
    }

    private void initializeDatabase() {
        try {
            // 1. Tenta encontrar o arquivo relativamente ao diretório do projeto
            Path projectPath = Paths.get("").toAbsolutePath();
            Path scriptPath = findScriptFile(projectPath);

            if (scriptPath == null) {
                // 2. Se não encontrar, tenta no diretório home do usuário
                Path homePath = Paths.get(System.getProperty("user.home"));
                scriptPath = findScriptFile(homePath);
            }

            if (scriptPath == null) {
                System.err.println("Arquivo SQL não encontrado. Procurando em: " + relativeScriptPath);
                return;
            }

            Resource scriptResource = new FileSystemResource(scriptPath.toFile());
            try (Connection connection = dataSource.getConnection()) {
                ScriptUtils.executeSqlScript(connection, scriptResource);
                System.out.println("Banco de dados inicializado com sucesso a partir de: " + scriptPath);
            }
        } catch (Exception e) {
            System.err.println("Falha ao inicializar o banco de dados: " + e.getMessage());
        }
    }

    private Path findScriptFile(Path basePath) {
        System.out.println("Buscando script a partir de: " + basePath);

        Path[] possiblePaths = {
                basePath.resolve("Dados/projetoSac.sql"),
                basePath.resolve("projetoSAC/Dados/projetoSac.sql"),
                basePath.resolve("Documentos/MeusProjetos/projetoSAC/Dados/projetoSac.sql")
        };

        for (Path path : possiblePaths) {
            System.out.println("Verificando: " + path.toAbsolutePath());
            if (Files.exists(path)) {
                System.out.println("Script encontrado em: " + path);
                return path;
            }
        }
        return null;
    }
}