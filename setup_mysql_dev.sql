-- prepares a MySQL server for the project

CREATE DATABASE IF NOT EXISTS my_keja_sql;
CREATE USER IF NOT EXISTS 'keja_admin'@'localhost' IDENTIFIED BY 'kadmin';
GRANT ALL PRIVILEGES ON `my_keja_sql`.* TO 'keja_admin'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'keja_admin'@'localhost';
FLUSH PRIVILEGES;
