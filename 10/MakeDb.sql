DROP DATABASE IF EXISTS dbTodos;
CREATE DATABASE IF NOT EXISTS dbTodos;
USE dbTodos;
CREATE TABLE IF NOT EXISTS tbTodos(
    position INT PRIMARY KEY,
    taskText TEXT NOT NULL,
    updateTime INT
);
INSERT INTO dbTodos.tbTodos (position, taskText, updateTime)
VALUES --
	(0, "Buy 1L milk.", 0),
    (1, "Purchase 250g cheese.", 1);