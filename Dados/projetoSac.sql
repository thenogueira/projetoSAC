CREATE DATABASE apoio_comunitario;
USE apoio_comunitario;
CREATE TABLE usuario (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(30) NOT NULL,
    tipo_conta ENUM('USUARIO', 'ADMINISTRADOR') NOT NULL, -- Valores já em maiúsculas e consistentes
    email VARCHAR(60) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    tipo_documento ENUM('CPF', 'CNPJ') NOT NULL,
    numero_documento VARCHAR(14) UNIQUE NOT NULL,
    status_conta ENUM('ATIVA', 'BANIDA') DEFAULT 'ATIVA'
);

CREATE TABLE usuario_banido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_documento VARCHAR(20) NOT NULL,
    email VARCHAR(60) NOT NULL,
    motivo TEXT NOT NULL,
    data_banimento DATE NOT NULL,
    admin_id INT UNSIGNED NOT NULL,
    usuario_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (admin_id) REFERENCES usuario(id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE ocorrencia (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    titulo VARCHAR(40) NOT NULL,
    descricao VARCHAR(200) NOT NULL,
    tipo ENUM('DOACAO', 'PEDIDO') NOT NULL, -- Valores em maiúsculas para consistência
    categoria VARCHAR(30) NOT NULL,
    localizacao VARCHAR(60) NOT NULL,
    estado_doacao VARCHAR(10),
    imagem MEDIUMBLOB,
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE avaliacao (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_avaliado_id INT UNSIGNED NOT NULL,
    usuario_avaliador_id INT UNSIGNED NOT NULL,
    nota INT UNSIGNED NOT NULL,
    CHECK (nota BETWEEN 1 AND 5),
    comentario VARCHAR(255),
    FOREIGN KEY(usuario_avaliado_id) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY(usuario_avaliador_id) REFERENCES usuario(id) ON DELETE CASCADE
);

-- Inserindo dados com os valores corretos do ENUM
INSERT INTO usuario VALUES ('1', 'Caio', 'USUARIO', 'caio@gmail.com', 'caio1234', 'CNPJ', '14118955719', 'ATIVA');
INSERT INTO usuario VALUES ('2', 'Rogerio', 'ADMINISTRADOR', 'roger@gmail.com', 'roger1234', 'CPF', '14113446', 'ATIVA');
INSERT INTO usuario VALUES ('3', 'Bartolomeu', 'USUARIO', 'bart@gmail.com', 'bart1234', 'CPF', '458579666', 'BANIDA');
INSERT INTO usuario VALUES ('4', 'Ronaldo', 'ADMINISTRADOR', 'ronald@gmail.com', 'ronald1234', 'CNPJ', '01255587', 'ATIVA');




