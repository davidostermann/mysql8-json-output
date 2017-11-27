CREATE DATABASE IF NOT EXISTS tododb2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tododb2;
DROP TABLE IF EXISTS users_tasks_categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS categories;
CREATE TABLE categories
(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255),
  PRIMARY KEY (id)
);
INSERT INTO categories(name) VALUES ('Backlogs'),('À faire'),('En cours'),('Fait');

CREATE TABLE tasks(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255),
  master_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY(master_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX (master_id)
);

INSERT INTO tasks(name, master_id) VALUES 
('Faire une requête SQL', 4),
('Faire une appli NodeJS', 2),
('Connecter l''appli à la BDD', 1),
('Créer des routes d''API', 2),
('Utiliser un ORM sur une base relationnelle', 1),
('Utiliser un ORM sur une base non-relationnelle', 4),
('Créer une web app pour interroger l''API', 2),
('Créer une relation One to Many', 3),
('Créer une relation Many to Many', 3);

CREATE TABLE users(
  id INT NOT NULL AUTO_INCREMENT,
  firstname VARCHAR(255),
  lastname VARCHAR(255),
  PRIMARY KEY (id)
);

INSERT INTO users(lastname, firstname) VALUES 
('Jovana', 'Bajat'),
('BE', 'Eugénie'),
('BELFEROUM', 'Nassim'),
('Châble', 'Stanislas'),
('Chekroun', 'Michael'),
('COHEN', 'Benjamin'),
('Coudoumié', 'Axel'),
('drame', 'boubacar'),
('EL BAKKAL', 'Amelle'),
('ENDEKI', 'Geoffrey'),
('Hattou', 'Faïssal'),
('Heinis', 'Steve');

CREATE TABLE users_tasks_categories(
 user_id INT,
 task_id INT,
 category_id INT NULL,
 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
 FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
 PRIMARY KEY (user_id, task_id),
 INDEX (user_id),
 INDEX (task_id),
 INDEX (category_id)
);

INSERT INTO users_tasks_categories(user_id, task_id, category_id) VALUES
(1, 1, 3),
(1, 9, 3),
(2, 2, 1),
(2, 4, 2),
(2, 7, 4),
(2, 9, 2),
(3, 1, 1),
(3, 8, 1),
(3, 3, 4),
(4, 1, 2),
(4, 6, 3),
(5, 8, 1),
(5, 3, 3),
(5, 4, 4),
(5, 1, 4),
(6, 7, 2),
(7, 7, 3),
(8, 6, 1),
(8, 5, 4),
(9, 4, 1),
(9, 3, 2),
(10, 3, 3),
(11, 2, 3),
(11, 1, 3),
(12, 8, 1);