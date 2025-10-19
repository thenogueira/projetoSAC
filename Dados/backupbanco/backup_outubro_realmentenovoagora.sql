-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: apoio_comunitario
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `avaliacao`
--

DROP TABLE IF EXISTS `avaliacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avaliacao` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `usuario_avaliado_id` int(10) unsigned NOT NULL,
  `usuario_avaliador_id` int(10) unsigned NOT NULL,
  `nota` int(10) unsigned NOT NULL,
  `comentario` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_avaliado_id` (`usuario_avaliado_id`),
  KEY `usuario_avaliador_id` (`usuario_avaliador_id`),
  CONSTRAINT `avaliacao_ibfk_1` FOREIGN KEY (`usuario_avaliado_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `avaliacao_ibfk_2` FOREIGN KEY (`usuario_avaliador_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `CONSTRAINT_1` CHECK (`nota` between 1 and 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comentario`
--

DROP TABLE IF EXISTS `comentario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comentario` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `texto` text NOT NULL,
  `data_criacao` datetime NOT NULL DEFAULT current_timestamp(),
  `data_atualizacao` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `usuario_id` int(10) unsigned NOT NULL,
  `usuario_alvo_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `fk_usuario_alvo_id` (`usuario_alvo_id`),
  CONSTRAINT `comentario_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_usuario_alvo_id` FOREIGN KEY (`usuario_alvo_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ocorrencia`
--

DROP TABLE IF EXISTS `ocorrencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ocorrencia` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` int(10) unsigned NOT NULL,
  `titulo` varchar(40) NOT NULL,
  `descricao` varchar(200) NOT NULL,
  `tipo` enum('DOACAO','PEDIDO') NOT NULL,
  `categoria` varchar(30) NOT NULL,
  `localizacao` varchar(60) NOT NULL,
  `estado_doacao` varchar(10) DEFAULT NULL,
  `imagem` mediumblob DEFAULT NULL,
  `data_criacao` datetime NOT NULL DEFAULT current_timestamp(),
  `data_atualizacao` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `ocorrencia_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(30) NOT NULL,
  `tipo_conta` enum('USUARIO','ADMINISTRADOR') NOT NULL,
  `email` varchar(60) NOT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `tipo_documento` enum('CPF','CNPJ') NOT NULL,
  `numero_documento` varchar(14) NOT NULL,
  `status_conta` enum('ATIVA','BANIDA') DEFAULT 'ATIVA',
  `foto_perfil` longblob DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `numero_documento` (`numero_documento`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuario_banido`
--

DROP TABLE IF EXISTS `usuario_banido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_banido` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `numero_documento` varchar(20) NOT NULL,
  `email` varchar(60) NOT NULL,
  `motivo` text NOT NULL,
  `data_banimento` datetime NOT NULL,
  `admin_id` int(10) unsigned NOT NULL,
  `usuario_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `admin_id` (`admin_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `usuario_banido_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `usuario_banido_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-19 17:16:33
