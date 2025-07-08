-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: apoio_comunitario
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
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
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `usuario_avaliado_id` int unsigned NOT NULL,
  `usuario_avaliador_id` int unsigned NOT NULL,
  `nota` int unsigned NOT NULL,
  `comentario` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_avaliado_id` (`usuario_avaliado_id`),
  KEY `usuario_avaliador_id` (`usuario_avaliador_id`),
  CONSTRAINT `avaliacao_ibfk_1` FOREIGN KEY (`usuario_avaliado_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `avaliacao_ibfk_2` FOREIGN KEY (`usuario_avaliador_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `avaliacao_chk_1` CHECK ((`nota` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avaliacao`
--

LOCK TABLES `avaliacao` WRITE;
/*!40000 ALTER TABLE `avaliacao` DISABLE KEYS */;
/*!40000 ALTER TABLE `avaliacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comentario`
--

DROP TABLE IF EXISTS `comentario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comentario` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `texto` text NOT NULL,
  `data_criacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_atualizacao` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `usuario_id` int unsigned NOT NULL,
  `ocorrencia_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `ocorrencia_id` (`ocorrencia_id`),
  CONSTRAINT `comentario_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comentario_ibfk_2` FOREIGN KEY (`ocorrencia_id`) REFERENCES `ocorrencia` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comentario`
--

LOCK TABLES `comentario` WRITE;
/*!40000 ALTER TABLE `comentario` DISABLE KEYS */;
/*!40000 ALTER TABLE `comentario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ocorrencia`
--

DROP TABLE IF EXISTS `ocorrencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ocorrencia` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` int unsigned NOT NULL,
  `titulo` varchar(40) NOT NULL,
  `descricao` varchar(200) NOT NULL,
  `tipo` enum('DOACAO','PEDIDO') NOT NULL,
  `categoria` varchar(30) NOT NULL,
  `localizacao` varchar(60) NOT NULL,
  `estado_doacao` varchar(10) DEFAULT NULL,
  `imagem` mediumblob,
  `data_criacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_atualizacao` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `ocorrencia_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ocorrencia`
--

LOCK TABLES `ocorrencia` WRITE;
/*!40000 ALTER TABLE `ocorrencia` DISABLE KEYS */;
INSERT INTO `ocorrencia` VALUES (1,5,'teste','desc','DOACAO','Alimentos','AP, Ruaaaaaaa',NULL,NULL,'2025-05-25 14:21:27',NULL),(2,5,'Quero dar comida','Tenho muito comida para dar','DOACAO','Alimentos','ES, Rua cosme Velho',NULL,_binary 'data:image/jpeg;base64,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','2025-06-06 07:29:09',NULL),(3,5,'teste','descc','DOACAO','Alimentos','MS, Ruaaaaaaa',NULL,NULL,'2025-06-06 07:42:26','2025-06-06 07:42:26'),(4,5,'teste','desccccc','DOACAO','Alimentos','PR, Ruaaaaaaa',NULL,NULL,'2025-06-06 07:43:57','2025-06-06 07:43:57'),(5,5,'teste','descccccc','DOACAO','Alimentos','MG, Ruaaaaaaa',NULL,NULL,'2025-06-06 07:46:27','2025-06-06 07:46:27'),(6,5,'testeeeeeeeeeeee','descccccc','DOACAO','Alimentos','MT, Ruaaaaaaa',NULL,NULL,'2025-06-06 07:48:49','2025-06-06 07:48:49'),(7,5,'teste','descccc','DOACAO','Alimentos','MG, Ruaaaaaaa',NULL,NULL,'2025-06-10 10:16:27','2025-06-10 10:16:27'),(8,5,'Quero dar comida','desccccccc','DOACAO','Alimentos','MA, Ruaaaaaaa',NULL,NULL,'2025-06-12 08:48:27','2025-06-12 08:48:27'),(9,5,'teste','descccc','DOACAO','Alimentos','MG, Ruaaaaaaa',NULL,NULL,'2025-06-12 08:48:49','2025-06-12 08:48:49'),(10,5,'teste','fdre','DOACAO','Alimentos','PB, Ruaaaaaaa',NULL,NULL,'2025-06-12 08:49:23','2025-06-12 08:49:23');
/*!40000 ALTER TABLE `ocorrencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(30) NOT NULL,
  `tipo_conta` enum('USUARIO','ADMINISTRADOR') NOT NULL,
  `email` varchar(60) NOT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `tipo_documento` enum('CPF','CNPJ') NOT NULL,
  `numero_documento` varchar(14) NOT NULL,
  `status_conta` enum('ATIVA','BANIDA') DEFAULT 'ATIVA',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `numero_documento` (`numero_documento`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Caio','USUARIO','caio@gmail.com','caio1234','CNPJ','14118955719','ATIVA'),(2,'Rogerio','ADMINISTRADOR','roger@gmail.com','roger1234','CPF','14113446','ATIVA'),(3,'Bartolomeu','USUARIO','bart@gmail.com','bart1234','CPF','458579666','BANIDA'),(4,'Ronaldo','ADMINISTRADOR','ronald@gmail.com','ronald1234','CNPJ','01255587','ATIVA'),(5,'Daniel Soares','USUARIO','abacatezinho@gmail.com','$2a$10$1p7kcjD0cHw556s6ZIYx8eQaijN5nzCQQhNPY6Cf4OuoSoT/2L.lC','CPF','12346778987','ATIVA'),(6,'Daniel Soares','USUARIO','abacatezinho2@gmail.com','$2a$10$K2Htvq6xNZT619iB4/EzveWwSqNf0wmc9OSw3pywgG3WJj3GW6LBC','CPF','12346778980','ATIVA');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_banido`
--

DROP TABLE IF EXISTS `usuario_banido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_banido` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero_documento` varchar(20) NOT NULL,
  `email` varchar(60) NOT NULL,
  `motivo` text NOT NULL,
  `data_banimento` datetime NOT NULL,
  `admin_id` int unsigned NOT NULL,
  `usuario_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `admin_id` (`admin_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `usuario_banido_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `usuario_banido_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_banido`
--

LOCK TABLES `usuario_banido` WRITE;
/*!40000 ALTER TABLE `usuario_banido` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario_banido` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-08  7:46:51
