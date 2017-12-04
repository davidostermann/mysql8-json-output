# Exercice 1 

## Préambule

Run SQL file setup_ex1.sql (cf. README.md)

## Afficher le nom de la liste dans laquelle se trouve la carte 3

Solution 1 (avec sous-requêtes)

```sql
SELECT name FROM lists
WHERE id = ( SELECT list_id FROM cards WHERE id = 3)
```

Solution 2 (avec alias)

```sql
SELECT * FROM cards as c
JOIN lists as l ON l.id = c.list_id WHERE c.id = 3
```

## Afficher toutes les cards de la list qui a l'id 3


Solution 1 (optimale)

```sql
SELECT * FROM cards WHERE list_id = 3
```

Solution 2 (bullshit)

```sql
SELECT * FROM lists
JOIN cards ON lists.id = list_id WHERE lists.id = 3
```

## Afficher toutes les cards du user qui a l'id 1

```sql
SELECT name, firstname, lastname FROM users_cards
JOIN cards ON cards.id = card_id
JOIN users ON users.id = user_id WHERE user_id = 1
```

## Afficher toutes les users associés à la card qui a l'id 2

```sql
SELECT card_id, firstname, lastname, name FROM users_cards
JOIN users ON users.id = user_id
JOIN cards ON cards.id = card_id WHERE card_id = 2
```

## Afficher les lists avec leurs cards associées :

### sans aggrégation

```sql
SELECT l.id as id, l.name as name, c.id as cid, c.name as tname
FROM lists as l
JOIN cards as c ON l.id = c.list_id
```

### Avec aggregation en mysql 5.7 (ou 5.6)

```sql
SELECT l.id, l.name,
CONCAT('[',
  GROUP_CONCAT(
    CONCAT('{"id":', c.id,',"name":"', c.name, '"}')
  )
, ']') as cards
FROM lists as l
JOIN cards as c ON l.id = c.list_id
GROUP BY c.list_id;
```

### En mieux, avec aggrégation en mysql 8 :

```sql
SELECT l.id, l.name,
JSON_ARRAYAGG(
  JSON_OBJECT("id", c.id, "name", c.name)
) as cards
FROM lists as l
JOIN cards as c ON l.id = c.list_id
GROUP BY c.list_id;
```

## Afficher tous les users avec leurs cards associées :

### Sans aggregation

```sql
SELECT u.id, u.lastname, u.firstname, c.id, c.name FROM users as u
INNER JOIN users_cards as uc ON uc.user_id = u.id
INNER JOIN cards as c ON uc.card_id = c.id;
```

### Avec aggregation en mysql 5.7 (ou 5.6)

```sql
SELECT l.name, CONCAT('["', GROUP_CONCAT( c.name SEPARATOR '","' ), '"]') as cards FROM lists as l
JOIN cards as c ON c.list_id = l.id
GROUP BY l.id
```

### Avec aggregation en mysql 5.7 EN MIEUX

```sql
SELECT l.name, 
CONCAT('[',
 GROUP_CONCAT( 
 	CONCAT('"', c.name, '"')
 ), 
']') as cards 
FROM lists as l
JOIN cards as c ON c.list_id = l.id
GROUP BY l.id
```

### Avec aggregation et en mysql 8 :

```sql
SELECT u.id, 
CONCAT(u.lastname,' ', u.firstname) as name, 
JSON_ARRAYAGG(JSON_OBJECT("id", uc.card_id, "name", c.name)) as cards
FROM users as u
JOIN users_cards as uc ON u.id = uc.user_id
JOIN cards as c ON c.id = uc.card_id
GROUP BY uc.user_id;
```

### Avec aggregation et en mysql 8 avec comme output un seul object JSON :

```sql
SELECT JSON_OBJECT(
"id", u.id, 
"name", CONCAT(u.lastname,' ', u.firstname), 
"cards", JSON_ARRAYAGG(JSON_OBJECT("id", uc.card_id, "name", c.name))) as user
FROM users as u
JOIN users_cards as uc ON u.id = uc.user_id
JOIN cards as c ON c.id = uc.user_id
GROUP BY uc.user_id;
```

## Afficher les lists avec pour chacune les cards et pour chaque cards les users associés

```sql
SELECT l.id, l.name, c.id as cid, c.name as cardname, u.id as uid, 
CONCAT(u.lastname,' ', u.firstname) as username 
FROM lists as l
JOIN cards as c ON l.id = c.list_id
JOIN users_cards as uc ON c.id = uc.card_id
JOIN users as u ON u.id = uc.user_id;
```

### Pas mieux sans nested SELECT :

```sql
SELECT l.id, l.name, JSON_ARRAYAGG( 
JSON_OBJECT("id", uc.card_id, "name", c.name, "user", 
JSON_OBJECT( "id", uc.user_id, "name", CONCAT(u.lastname,' ', u.firstname) ) ) ) as cards
FROM lists as l
JOIN cards as c ON l.id = c.list_id
JOIN users_cards as uc ON c.id = uc.card_id
JOIN users as u ON u.id = uc.user_id
GROUP BY l.id;
```

### Avec nested SELECT :
(Celle-ci, elle a été galère à faire !)

```sql
SELECT 
l.id as id, 
l.name as name, 
JSON_ARRAYAGG(
  JSON_OBJECT("id", c.id, "name", c.name, "users", ucr.users)
) as cards 
FROM
(
  SELECT uc.card_id as cid, 
  JSON_ARRAYAGG(
    JSON_OBJECT(
      "id", uc.user_id, 
      "name", CONCAT(u.lastname,' ', u.firstname)
    )
  ) as users
  FROM users_cards as uc
  JOIN users as u ON u.id = uc.user_id
  GROUP BY uc.card_id
) ucr
JOIN cards as c ON ucr.cid = c.id
JOIN lists as l ON l.id = c.list_id
GROUP BY c.list_id;
```