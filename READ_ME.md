# mysql 8.0 and JSON output

ref. : https://mysqlserverteam.com/mysql-8-0-labs-json-aggregation-functions/

## Install DB and Adminer :

```
docker-compose up
```
## Connection

### Go to localhost:8080

Credentials :
``` 
System : MySQL
Server : db
Username : root
Password : example
Database : (keep it empty
```

### Or connect via mysql command line cli :

```docker ps``` to retrieve mysql container ID

```docker exec -ti [mysql container ID] bash``` to start shell interface

```mysql -u root -p``` to run mysql command line cli

## DB Creation

* via mysql command line cli, copy/paste setup.sql content
* via Adminer :
  
  * click on "run sql command"
  * copy/paste setup.sql content
  * click on "execute"

-----

# Exercices

## Afficher les categories avec leurs todos associées :

```sql
SELECT c.id as id, c.name as name, t.id as tid, t.name as tname
FROM categories as c
JOIN todos as t ON c.id = t.category_id
```

### En mieux, avec aggrégation (GROUP BY et JSON_ARRAYAGG) :

```sql
SELECT c.id, c.name,
JSON_ARRAYAGG(
  JSON_OBJECT("id", t.id, "name", t.name)
) as todos
FROM categories as c
JOIN todos as t ON c.id = t.category_id
GROUP BY t.category_id;
```

## Afficher tous les users avec leurs todos associées :

```sql
SELECT u.id, u.lastname, u.firstname, t.id, t.name FROM users as u
INNER JOIN users_todos as ut ON ut.user_id = u.id
INNER JOIN todos as t ON ut.user_id = t.id;
```

### Et en JSON exploitable directement :

```sql
SELECT u.id, 
CONCAT(u.lastname,' ', u.firstname) as name, 
JSON_ARRAYAGG(JSON_OBJECT("id", ut.todo_id, "name", t.name)) as todos
FROM users as u
JOIN users_todos as ut ON u.id = ut.user_id
JOIN todos as t ON t.id = ut.user_id
GROUP BY ut.user_id;
```

```sql
SELECT JSON_OBJECT(
"id", u.id, 
"name", CONCAT(u.lastname,' ', u.firstname), 
"todos", JSON_ARRAYAGG(JSON_OBJECT("id", ut.todo_id, "name", t.name))) as user
FROM users as u
JOIN users_todos as ut ON u.id = ut.user_id
JOIN todos as t ON t.id = ut.user_id
GROUP BY ut.user_id;
```

## Afficher les categories avec pour chacune les todos et pour chaque todos les users associés

```sql
SELECT c.id, c.name, t.id as tid, t.name as todoname, u.id as uid, 
CONCAT(u.lastname,' ', u.firstname) as username 
FROM categories as c
JOIN todos as t ON c.id = t.category_id
JOIN users_todos as ut ON t.id = ut.todo_id
JOIN users as u ON u.id = ut.user_id;
```

### Pas mieux sans nested SELECT :

```sql
SELECT c.id, c.name, JSON_ARRAYAGG( 
JSON_OBJECT("id", ut.todo_id, "name", t.name, "user", 
JSON_OBJECT( "id", ut.user_id, "name", CONCAT(u.lastname,' ', u.firstname) ) ) ) as todos
FROM categories as c
JOIN todos as t ON c.id = t.category_id
JOIN users_todos as ut ON t.id = ut.todo_id
JOIN users as u ON u.id = ut.user_id
GROUP BY t.category_id;
```

### Avec nested SELECT :
(Celle-ci, elle a été galère à faire !)

```sql
SELECT 
c.id as id, 
c.name as name, 
JSON_ARRAYAGG(
  JSON_OBJECT("id", t.id, "name", t.name, "users", utr.users)
) as todos 
FROM
(
  SELECT ut.todo_id as tid, 
  JSON_ARRAYAGG(
    JSON_OBJECT(
      "id", ut.user_id, 
      "name", CONCAT(u.lastname,' ', u.firstname)
    )
  ) as users
  FROM users_todos as ut
  JOIN users as u ON u.id = ut.user_id
  GROUP BY ut.todo_id
) utr
JOIN todos as t ON utr.tid = t.id
JOIN categories as c ON c.id = t.category_id
GROUP BY t.category_id;
```
