# Exercices 2 (a faire sur tododb2)

## Afficher toutes les tasks du user 1

Vous devez associer la table de jointure :

```sql
SELECT t.name FROM tasks as t
JOIN users_tasks_categories as utc ON t.id = utc.task_id
WHERE utc.user_id = 1;
```

Dans l'autre sens :

```sql
SELECT t.name FROM users_tasks_categories as utc
JOIN tasks as t ON t.id = utc.task_id
WHERE utc.user_id = 1;
```

## Afficher tous les users qui ont des tasks en categories 3

```sql
SELECT u.firstname
FROM users_tasks_categories as utc
JOIN users as u ON u.id = utc.user_id
JOIN tasks as t ON t.id = utc.task_id
WHERE utc.category_id = 3;
```

En mieux avec DISTINCT :

```sql
SELECT DISTINCT u.firstname
FROM users_tasks_categories as utc
JOIN users as u ON u.id = utc.user_id
JOIN tasks as t ON t.id = utc.task_id
WHERE utc.category_id = 3;
```

## Pour plus de détail, ajouter, pour chaque utilisateur, le nom des tasks qu'ils ont en catégorie 1

```sql
SELECT u.firstname, GROUP_CONCAT( DISTINCT t.name SEPARATOR ', ' )
FROM users_tasks_categories as utc
JOIN users as u ON u.id = utc.user_id
JOIN tasks as t ON t.id = utc.task_id
WHERE utc.category_id = 3
GROUP BY u.id;
```

## Afficher les tasks avec les categories associés:

```sql
SELECT t.id, t.name, c.name
FROM tasks as t
JOIN users_tasks_categories as utc ON utc.task_id=t.id
JOIN categories as c ON c.id = utc.category_id
ORDER BY t.id
```

En mieux en groupant : 

```sql 
SELECT t.id as 'task id', t.name, GROUP_CONCAT( DISTINCT  c.name )
FROM tasks as t
JOIN users_tasks_categories as utc ON utc.task_id=t.id
JOIN categories as c ON c.id = utc.category_id
GROUP BY t.id
ORDER BY t.id
```

En JSON :

```sql 
SELECT t.id as 'task id', t.name, 
GROUP_CONCAT( DISTINCT CONCAT('{"id":', c.id, ', "name":', c.name ,'}') )
FROM tasks as t
JOIN users_tasks_categories as utc ON utc.task_id=t.id
JOIN categories as c ON c.id = utc.category_id
GROUP BY t.id
ORDER BY t.id
```

En JSON avec SQL8
(Attention le DISTINCT ne fonctionne pas avec JSON)

```sql
SELECT t.id as 'task id', t.name, JSON_ARRAYAGG( JSON_OBJECT('id', c.id, 'name', c.name ) )
FROM tasks as t
JOIN users_tasks_categories as utc ON utc.task_id=t.id
JOIN categories as c ON c.id = utc.category_id
GROUP BY t.id
ORDER BY t.id
```

## Afficher les catégories avec leurs tâches associées et avec pour chaque tâches, la liste des utilisateurs associés

```sql
SELECT c.name, GROUP_CONCAT( CONCAT('{"task":', rutc.tname, ', "users":[', rutc.users ,']}')) as tasks
FROM (
  SELECT utc.category_id as cid, t.id as tid, t.name as tname, GROUP_CONCAT( u.firstname ) as users
  FROM users_tasks_categories as utc
  JOIN users as u ON u.id = utc.user_id
  JOIN tasks as t ON t.id = utc.task_id
  GROUP BY utc.category_id, utc.task_id
) as rutc
JOIN categories as c ON c.id = rutc.cid
GROUP BY c.id
```

*Attention, les firstname ne sont pas JSON compatible. Il manque les doublequote*

En SQL 8 :

```sql
SELECT c.name, JSON_ARRAYAGG( JSON_OBJECT('task', rutc.tname, 'users', rutc.users )) as tasks
FROM (
  SELECT t.id as tid, t.name as tname, utc.category_id as cid, JSON_ARRAYAGG( u.firstname ) as users
  FROM users_tasks_categories as utc
  JOIN users as u ON u.id = utc.user_id
  JOIN tasks as t ON t.id = utc.task_id
  GROUP BY utc.category_id, utc.task_id
) as rutc
JOIN categories as c ON c.id = rutc.cid
GROUP BY c.id
```

## Récupérer par catégories, toutes les todos ordonnées par categorie. Chaque todos doit comprendre un tableau de user.

```sql
SELECT category_id, c.name, task_id, t.name, JSON_ARRAYAGG(u.firstname), COUNT(DISTINCT user_id) FROM 
users_tasks_categories as utc
JOIN categories as c ON c.id = category_id
JOIN tasks as t ON t.id = task_id
JOIN users as u ON u.id = user_id
WHERE task_id = 3
GROUP BY category_id, task_id
```