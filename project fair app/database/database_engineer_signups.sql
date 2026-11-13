CREATE DATABASE IF NOT EXISTS projectexpert_engineer_signups CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE projectexpert_engineer_signups;

CREATE TABLE IF NOT EXISTS engineer_signups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(255) NOT NULL,
  school VARCHAR(255) NOT NULL,
  bio TEXT NOT NULL,
  skills JSON NOT NULL,
  whatsapp VARCHAR(255) NOT NULL,
  skype VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,
  image VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
