API de Gestion de Films

Ce projet est une API RESTful développée en TypeScript, conçue pour gérer une collection de films. Elle permet la création, la lecture, la mise à jour et la suppression (CRUD) des données relatives aux films.
**********Fonctionnalités principales***********

    Ajout de nouveaux films avec des détails tels que le titre, le réalisateur, l'année de sortie, etc.

    Récupération de la liste complète des films ou d'un film spécifique par son identifiant.

    Mise à jour des informations d'un film existant.

    Suppression d'un film de la collection.

    Documentation de l'API avec Swagger.

**********Technologies utilisées*********

    Langage : TypeScript

    Framework : Express.js

    Base de données : MongoDB

    Outils :

        Docker pour la conteneurisation

        Docker Compose pour l'orchestration des conteneurs

        Swagger pour la documentation de l'API

        Postman pour les tests des endpoints
        GitHub+3GitHub+3GitHub+3

******Structure du projet********

api_Projet/
├── src/
│   ├── controllers/       # Logique métier pour les routes
│   ├── models/            # Schémas de données MongoDB
│   ├── routes/            # Définition des routes de l'API
│   └── index.ts           # Point d'entrée de l'application
├── .env                   # Variables d'environnement
├── docker-compose.yml     # Configuration Docker Compose
├── Dockerfile             # Fichier Docker
├── package.json           # Dépendances et scripts npm
├── README.md              # Documentation du projet
└── swagger.json           # Documentation Swagger de l'API

*********Installation et exécution*********

    Cloner le dépôt :

    git clone https://github.com/jael99/api_Projet.git

GitHub

    Se déplacer dans le répertoire du projet :

    cd api_Projet

    Créer un fichier .env à la racine du projet en se basant sur le fichier .env.example et y renseigner les variables d'environnement nécessaires.

    Construire et démarrer les conteneurs Docker :

    docker-compose up --build

    L'API sera accessible à l'adresse http://localhost:3000.

******Contact******

Pour toute question ou suggestion, veuillez contacter :

    Développeur : Jael Etswaka

    Email : etswakajael@gmail.com

    LinkedIn : jael-etswaka
