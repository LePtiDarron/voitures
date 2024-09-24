from cars import *
from accounts import *
import requests
import mysql.connector
from mysql.connector import Error
from faker import Faker
import os

DATABASE_CONFIG = {
    'user': 'root',
    'password': 'root',
    'host': '127.0.0.1',
    'database': 'tomobil'
}

ADD_CAR_URL = 'http://127.0.0.1:8000/api/cars'
SIGNUP_URL = 'http://127.0.0.1:8000/api/signup'

fake = Faker('fr_FR')

def create_cars():
    try:
        connection = mysql.connector.connect(**DATABASE_CONFIG)
        if connection.is_connected():
            cursor = connection.cursor()

            cursor.execute("DELETE FROM car")
            connection.commit()
            print("La table 'car' a été vidée.")

            for car in cars:
                files = []
                for picture in car['pictures']:
                    if os.path.isfile(picture):
                        files.append(('pictures[]', (os.path.basename(picture), open(picture, 'rb'), 'image/png')))
                    else:
                        print(f"Fichier introuvable : {picture}")

                data = {k: v for k, v in car.items() if k != 'pictures'}
                data['transactionType'] = 'vente'

                response = requests.post(ADD_CAR_URL, data=data, files=files)
                if response.status_code == 201:
                    print(f"Voiture créée avec succès : {car['brand']} {car['model']}")
                else:
                    print(f"Échec de la création de la voiture : {response.status_code} - {response.text}")

    except Error as e:
        print(f"Erreur lors de la connexion à MySQL ou de l'exécution de la requête : {e}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("Connexion MySQL fermée.")

def create_accounts():
    try:
        connection = mysql.connector.connect(**DATABASE_CONFIG)
        if connection.is_connected():
            cursor = connection.cursor()

            cursor.execute("DELETE FROM user")
            connection.commit()
            print("La table 'user' a été vidée.")

            for account in accounts:
                files = {}
                if os.path.isfile(account['profile_picture']):
                    files['profilePicture'] = (os.path.basename(account['profile_picture']),
                                               open(account['profile_picture'], 'rb'),
                                               'image/png')
                else:
                    print(f"Fichier introuvable : {account['profile_picture']}")

                data = {k: v for k, v in account.items() if k != 'profile_picture'}
                
                response = requests.post(SIGNUP_URL, data=data, files=files)
                
                if response.status_code == 201:
                    print(f"Compte créé avec succès : {account['username']}")
                else:
                    print(f"Échec de la création du compte : {response.status_code} - {response.text}")

            cursor.execute("UPDATE user SET roles = %s WHERE username = %s", ('["ADMIN"]', 'admin'))
            connection.commit()
            print("Le rôle 'ADMIN' a été ajouté à l'utilisateur 'admin'.")

    except Error as e:
        print(f"Erreur lors de la connexion à MySQL ou de l'exécution de la requête : {e}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("Connexion MySQL fermée.")
    
create_cars()
create_accounts()