CREATE DATABASE IF NOT EXISTS boarddb2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE boarddb2;
DROP TABLE IF EXISTS users_cards_lists;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS lists;
CREATE TABLE lists
(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255),
  PRIMARY KEY (id)
);
INSERT INTO lists(name) VALUES ('Backlogs'),('À faire'),('En cours'),('Fait');

CREATE TABLE cards(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255),
  PRIMARY KEY (id)
);

INSERT INTO cards(name) VALUES 
('Faire une requête SQL'),
('Faire une appli NodeJS'),
('Connecter l''appli à la BDD'),
('Créer des routes d''API'),
('Utiliser un ORM sur une base relationnelle'),
('Utiliser un ORM sur une base non-relationnelle'),
('Créer une web app pour interroger l''API'),
('Créer une relation One to Many'),
('Créer une relation Many to Many');

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

CREATE TABLE users_cards_lists(
 user_id INT,
 card_id INT,
 list_id INT NULL,
 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
 FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE SET NULL,
 PRIMARY KEY (user_id, card_id),
 INDEX (user_id),
 INDEX (card_id),
 INDEX (list_id)
);

INSERT INTO users_cards_lists(user_id, card_id, list_id) VALUES
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