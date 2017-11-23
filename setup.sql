CREATE DATABASE IF NOT EXISTS tododb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tododb;
DROP TABLE IF EXISTS users_todos;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS todos;
DROP TABLE IF EXISTS categories;
CREATE TABLE categories
(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255),
  PRIMARY KEY (id)
);
INSERT INTO categories(name) VALUES ('Backlogs'),('À faire'),('En cours'),('Fait');

CREATE TABLE todos(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255),
  category_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX (category_id)
);

INSERT INTO todos(name, category_id) VALUES 
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

CREATE TABLE users_todos(
 user_id INT,
 todo_id INT,
 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE,
 PRIMARY KEY (user_id, todo_id),
 INDEX (user_id),
 INDEX (todo_id)
);

INSERT INTO users_todos(user_id, todo_id) VALUES
(1, 1),
(1, 9),
(2, 2),
(2, 4),
(2, 7),
(2, 9),
(3, 1),
(3, 8),
(3, 3),
(4, 1),
(4, 6),
(5, 8),
(5, 3),
(5, 4),
(5, 1),
(6, 7),
(7, 7),
(8, 6),
(8, 5),
(9, 4),
(9, 3),
(10, 3),
(11, 2),
(11, 1),
(12, 8);