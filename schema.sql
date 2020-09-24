DROP DATABASE IF EXISTS c_m_s;
CREATE DATABASE c_m_s;

USE c_m_s;

CREATE TABLE department(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR (45) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR (45) NOT NULL,
  salary DECIMAL (10,2) NULL,
  department_id INT NOT NULL,
  FOREIGN KEY (`department_id`) REFERENCES `department` (`id`) ON DELETE CASCADE,
  PRIMARY KEY (id)
);

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR (45) NOT NULL,
  last_name VARCHAR (45) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`manager_id`) REFERENCES `role` (`id`) ON DELETE CASCADE,
  PRIMARY KEY (id)
);
