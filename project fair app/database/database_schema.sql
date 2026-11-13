CREATE DATABASE IF NOT EXISTS projectexpert CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS projectexpert_users CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS projectexpert_engineer_signups CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE projectexpert;

CREATE TABLE IF NOT EXISTS engineers (
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

INSERT INTO engineers (name, specialty, school, bio, skills, whatsapp, skype, phone, image)
VALUES
  ('Amina Okafor', 'Electronics design specialist', 'University of Lagos', 'Electronics design specialist', '["PCB", "Testing", "Circuit design"]', '+2348030001111', 'live:aminaokafor', '+2348030001111', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'),
  ('Chinedu Adebayo', 'Embedded systems engineer', 'Federal University of Technology, Akure', 'Embedded systems engineer', '["Firmware", "IoT", "Microcontrollers"]', '+2348100102222', 'live:chineduadebayo', '+2348100102222', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'),
  ('Tosin Adeyemi', 'Research and prototyping lead', 'Obafemi Awolowo University', 'Research and prototyping lead', '["Research", "Prototyping", "Testing"]', '+2348120203333', 'live:tosinadeyemi', '+2348120203333', 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=800&q=80'),
  ('Zainab Musa', 'Hardware product engineer', 'Ahmadu Bello University', 'Hardware product engineer', '["Design", "Automation", "Product validation"]', '+2348140304444', 'live:zainabmusa', '+2348140304444', 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=800&q=80'),
  ('Kehinde Bello', 'Mechatronics engineer', 'University of Ibadan', 'Mechatronics engineer', '["Robotics", "Sensors", "Automation"]', '+2348160405555', 'live:kehindebello', '+2348160405555', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'),
  ('Ifeoma Nwosu', 'AI and automation specialist', 'University of Benin', 'AI and automation specialist', '["Machine learning", "Data analysis", "Automation"]', '+2348180506666', 'live:ifeomanwosu', '+2348180506666', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80')
ON DUPLICATE KEY UPDATE name = VALUES(name);

USE projectexpert_users;

CREATE TABLE IF NOT EXISTS user_logins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
