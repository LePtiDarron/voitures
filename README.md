# tomobil

## Lancer le front
cd front
npm i
npm start

## Lancer le back
Remplir le .env: DATABASE_URL
cd back
rm migrations/Version*.php
composer install
composer update
php bin/console doctrine:database:create
php bin/console make:migration
php bin/console doctrine:migrations:migrate
symfony server:start --no-tls

## Generer des comptes et voitures
Lancer le back, puis dans un nouveau terminal
->
cd setup_db
->
py setup.py
ou
python3 setup.py
ou
python2  setup.py
(selon la version de python installé)
