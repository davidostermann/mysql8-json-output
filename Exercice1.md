# Exercice 1 

## Préambule

Run SQL file setup_ex1.sql (cf. README.md)

## Afficher les lists avec leurs cards associées :

```sql
SELECT l.id as id, l.name as name, c.id as cid, c.name as tname
FROM lists as l
JOIN cards as c ON l.id = c.list_id
```

### En mieux, avec aggrégation (GROUP BY et JSON_ARRAYAGG) :

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

```sql
SELECT u.id, u.lastname, u.firstname, c.id, c.name FROM users as u
INNER JOIN users_cards as uc ON uc.user_id = u.id
INNER JOIN cards as c ON uc.card_id = c.id;
```
 
### Et en JSON exploitable directement :

```sql
SELECT u.id, 
CONCAT(u.lastname,' ', u.firstname) as name, 
JSON_ARRAYAGG(JSON_OBJECT("id", uc.card_id, "name", c.name)) as cards
FROM users as u
JOIN users_cards as uc ON u.id = uc.user_id
JOIN cards as c ON c.id = uc.card_id
GROUP BY uc.user_id;
```

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
