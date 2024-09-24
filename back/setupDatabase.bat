@echo off
setlocal

:: Configuration
set MYSQL_ROOT_USER=root
set MYSQL_ROOT_PASS=rootpwd
set DB_NAME=tomobil
set DB_USER=tomobil_user
set DB_PASS=tomobil_pwd

:: Créer l'utilisateur et la base de données
(
echo CREATE DATABASE IF NOT EXISTS %DB_NAME%;
echo CREATE USER IF NOT EXISTS '%DB_USER%'@'localhost' IDENTIFIED BY '%DB_PASS%';
echo GRANT ALL PRIVILEGES ON %DB_NAME%.* TO '%DB_USER%'@'localhost';
echo FLUSH PRIVILEGES;
) | mysql -u %MYSQL_ROOT_USER% -p%MYSQL_ROOT_PASS%

:: Afficher l'URL de connexion
echo.
echo URL de connexion a la base de donnees:
echo mysql://%DB_USER%:%DB_PASS%@localhost:3306/%DB_NAME%

endlocal
pause
