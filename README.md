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
Database : (keep it empty)
```

### Or connect via mysql command line cli :

```docker ps``` to retrieve mysql container ID

```docker exec -ti [mysql container ID] bash``` to start shell interface

```mysql -u root -p``` to run mysql command line cli

## DB Creation pour exercice 1 :

* via shell :

  * mysql < setup_ex1.sql
  
* via Adminer :
  
  * click on "run sql command"
  * copy/paste setup_ex1.sql content
  * click on "execute"

## DB Creation pour exercice 2 :

* via shell :

  * mysql < setup_ex2.sql
  
* via Adminer :
  
  * click on "run sql command"
  * copy/paste setup_ex2.sql content
  * click on "execute"
