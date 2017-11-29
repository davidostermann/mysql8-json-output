# Exercices 2

## Préambule

Run SQL file setup_ex2.sql (cf. README.md)

## Afficher toutes les cards du user 1

Vous devez associer la table de jointure :

```sql
SELECT c.name 
FROM cards as c
JOIN users_cards_lists as ucl ON c.id = ucl.card_id
WHERE ucl.user_id = 1;
```

Dans l'autre sens :

```sql
SELECT c.name 
FROM users_cards_lists as ucl
JOIN cards as c ON c.id = ucl.card_id
WHERE ucl.user_id = 1;
```

## Afficher tous les users qui ont des cards en lists 3

```sql
SELECT u.firstname
FROM users_cards_lists as ucl
JOIN users as u ON u.id = ucl.user_id
JOIN cards as c ON c.id = ucl.card_id
WHERE ucl.list_id = 3;
```

En mieux avec DISTINCT :

```sql
SELECT DISTINCT u.firstname
FROM users_cards_lists as ucl
JOIN users as u ON u.id = ucl.user_id
JOIN cards as c ON c.id = ucl.card_id
WHERE ucl.list_id = 3;
```

## Pour plus de détail, ajouter, pour chaque utilisateur, le nom des cards qu'ils ont en liste 1

```sql
SELECT u.firstname, GROUP_CONCAT( DISTINCT c.name SEPARATOR ', ' )
FROM users_cards_lists as ucl
JOIN users as u ON u.id = ucl.user_id
JOIN cards as c ON c.id = ucl.card_id
WHERE ucl.list_id = 3
GROUP BY u.id;
```

## Afficher les cards avec les lists associés:

```sql
SELECT c.id, c.name, cat.name
FROM cards as c
JOIN users_cards_lists as ucl ON ucl.card_id = c.id
JOIN lists as cat ON cat.id = ucl.list_id
ORDER BY c.id
```

En mieux en groupant : 

```sql 
SELECT c.id as 'card id', c.name, GROUP_CONCAT( DISTINCT  cat.name )
FROM cards as c
JOIN users_cards_lists as ucl ON ucl.card_id = c.id
JOIN lists as cat ON cat.id = ucl.list_id
GROUP BY c.id
ORDER BY c.id
```

En JSON :

```sql 
SELECT c.id as 'card id', c.name, 
GROUP_CONCAT( DISTINCT CONCAT('{"id":', cat.id, ', "name":', cat.name ,'}') )
FROM cards as c
JOIN users_cards_lists as ucl ON ucl.card_id=t.id
JOIN lists as cat ON cat.id = ucl.list_id
GROUP BY c.id
ORDER BY c.id
```

En JSON avec SQL8
(Attention le DISTINCT ne fonctionne pas avec JSON)

```sql
SELECT c.id as 'card id', c.name, JSON_ARRAYAGG( JSON_OBJECT('id', cat.id, 'name', cat.name ) )
FROM cards as c
JOIN users_cards_lists as ucl ON ucl.card_id = t.id
JOIN lists as cat ON cat.id = ucl.list_id
GROUP BY c.id
ORDER BY c.id
```

## Afficher les listes avec leurs tâches associées et avec pour chaque tâches, la liste des utilisateurs associés

```sql
SELECT cat.name, GROUP_CONCAT( CONCAT('{"card":', rucl.cname, ', "users":[', rucl.users ,']}')) as cards
FROM (
  SELECT ucl.list_id as lid, c.id as cid, c.name as cname, GROUP_CONCAT( u.firstname ) as users
  FROM users_cards_lists as ucl
  JOIN users as u ON u.id = ucl.user_id
  JOIN cards as c ON c.id = ucl.card_id
  GROUP BY ucl.list_id, ucl.card_id
) as rucl
JOIN lists as cat ON cat.id = rucl.cid
GROUP BY cat.id
```

*Attention, les firstname ne sont pas JSON compatible. Il manque les doublequote*

### Better En SQL 8 :

```sql
SELECT cat.name, JSON_ARRAYAGG( JSON_OBJECT('card', rucl.cname, 'users', rucl.users )) as cards
FROM (
  SELECT c.id as cid, c.name as cname, ucl.list_id as lid, JSON_ARRAYAGG( u.firstname ) as users
  FROM users_cards_lists as ucl
  JOIN users as u ON u.id = ucl.user_id
  JOIN cards as c ON c.id = ucl.card_id
  GROUP BY ucl.list_id, ucl.card_id
) as rucl
JOIN lists as cat ON cat.id = rucl.cid
GROUP BY cat.id
```

## Récupérer par listes, toutes les todos ordonnées par liste. Chaque todos doit comprendre un tableau de user.

```sql
SELECT list_id, cat.name, card_id, c.name, JSON_ARRAYAGG(u.firstname), COUNT(card_id) 
FROM users_cards_lists as ucl
JOIN lists as cat ON cat.id = list_id
JOIN cards as c ON c.id = card_id
JOIN users as u ON u.id = user_id
WHERE card_id = 3
GROUP BY list_id, card_id
```

### Avec un distinct

```sql
SELECT list_id, cat.name, card_id, c.name, JSON_ARRAYAGG(u.firstname), COUNT(DISTINCT user_id) 
FROM users_cards_lists as ucl
JOIN lists as cat ON cat.id = list_id
JOIN cards as c ON c.id = card_id
JOIN users as u ON u.id = user_id
WHERE card_id = 3
GROUP BY list_id, card_id
```