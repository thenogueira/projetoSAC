CREATE DATABASE apoio_comunitario;
use apoio_comunitario;
CREATE TABLE usuario (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(30) NOT NULL,
    tipo_conta ENUM('Usuario', 'Administrador'),
    email VARCHAR (40) UNIQUE NOT NULL,
    senha_hash VARCHAR (255) NOT NULL,
    tipo_documento ENUM('CPF', 'CNPJ') NOT NULL,
    numero_documento VARCHAR(14) UNIQUE NOT NULL
);

CREATE TABLE ocorrencia (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    titulo VARCHAR(40) NOT NULL,
    descricao VARCHAR(200) NOT NULL,
    tipo ENUM('Doação', 'Pedido') NOT NULL,
    categoria VARCHAR(30) NOT NULL,
    localizacao VARCHAR(60) NOT NULL,
    estado_doacao VARCHAR(10),
    imagem MEDIUMBLOB, 
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE

);


CREATE TABLE avaliacao (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_avaliado_id INT UNSIGNED NOT NULL,
    usuario_avaliador_id INT UNSIGNED NOT NULL,
    nota INT UNSIGNED NOT NULL,
    CHECK (
		(nota >=1 AND nota <=5)
    ),
    comentario VARCHAR(255),
    
    FOREIGN KEY(usuario_avaliado_id) references usuario(id) ON DELETE CASCADE,
    FOREIGN KEY(usuario_avaliador_id) references usuario(id) ON DELETE CASCADE
);
INSERT INTO usuario VALUES ('1', 'Caio', 'Usuario', 'caio@gmail.com', 'caio1234', 'CNPJ', '14116955879');
INSERT INTO usuario VALUES ('2', 'Rogerio', 'Usuario', 'homer@gmail.com', 'caio1234', 'CNPJ', '14113446');
INSERT INTO usuario VALUES ('3', 'Lewandowisk', 'Administrador', 'lewa@gmail.com', 'lewa1234', 'CPF', '141134146');

SELECT * from usuario;