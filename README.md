# API de Gestion des Voitures 🚗

Une API REST moderne pour la gestion d'un parc automobile, développée avec Node.js et Express. Cette API permet aux utilisateurs de gérer leurs véhicules avec un système d'authentification JWT et des rôles administrateur.

## 🎯 Fonctionnalités

### 👤 Gestion des utilisateurs
- **Inscription** et **connexion** sécurisées
- **Authentification JWT** avec tokens sécurisés
- **Gestion des rôles** (utilisateur/administrateur)
- **Profils utilisateurs** personnalisés

### 🚙 Gestion des véhicules
- **Catalogue des voitures** avec pagination et filtres
- **CRUD complet** : Créer, lire, modifier, supprimer
- **Propriété des véhicules** : chaque utilisateur gère ses voitures
- **Recherche avancée** par marque, prix, année

### 🛡️ Sécurité et Performance
- **Rate limiting** pour prévenir les attaques par déni de service
- **Validation des données** avec Joi
- **Gestion des erreurs** centralisée
- **CORS** configuré pour les accès cross-origin
- **Headers de sécurité** appropriés

### 🔧 Administration
- **Panneau administrateur** pour gérer tous les utilisateurs
- **Vue globale** de tous les véhicules du système
- **Contrôles d'accès** basés sur les rôles

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation
```bash
# Installer les dépendances
npm install
```

### Démarrage
```bash
# Mode développement avec rechargement automatique
npm run bis

# Mode production
npm start
```

## 📚 Documentation API

### Documentation interactive
Une fois le serveur lancé, accédez à la documentation Swagger :
- **URL** : `http://localhost:3000/api/dev/docs`
- **Interface** : Swagger UI interactive
- **Test direct** : Testez les endpoints directement dans l'interface

### Structure des routes

#### Authentification
- `POST /api/v1/auth/signup` - Créer un compte utilisateur
- `POST /api/v1/auth/login` - Se connecter et obtenir un token JWT

#### Gestion des véhicules
- `GET /api/v1/cars` - Lister toutes les voitures (public)
- `GET /api/v1/cars/:id` - Détails d'un véhicule (authentifié)
- `POST /api/v1/cars` - Ajouter un nouveau véhicule (authentifié)
- `PUT /api/v1/cars/:id` - Modifier un véhicule (propriétaire)
- `DELETE /api/v1/cars/:id` - Supprimer un véhicule (propriétaire)

#### Profil utilisateur
- `GET /api/v1/users/profile` - Récupérer son profil (authentifié)

#### Administration (admin uniquement)
- `GET /api/v1/admin/users` - Lister tous les utilisateurs
- `GET /api/v1/admin/cars` - Lister toutes les voitures avec propriétaires

## 🔑 Authentification

### Inscription
```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"motdepasse123"}'
```

### Connexion
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"motdepasse123"}'
```

### Utilisation du token
```bash
curl -H "Authorization: Bearer VOTRE_TOKEN_JWT" \
  http://localhost:3000/api/v1/users/profile
```

## 💾 Base de données

L'application utilise une base de données en mémoire pour le développement avec des données de démonstration pré-chargées :

### Utilisateurs de test
- `user1@example.com` / `password` (Utilisateur standard)
- `user2@example.com` / `password` (Utilisateur standard)  
- `admin@example.com` / `password` (Administrateur)

### Véhicules de démonstration
- Toyota Camry 2020 - 25,000€
- Honda Civic 2021 - 22,000€
- BMW X5 2022 - 65,000€
- Mercedes C-Class 2023 - 45,000€
- Ford Mustang 2021 - 35,000€
- *Et 5 autres véhicules...*

## 🛠️ Développement

### Génération de tokens de test
En mode développement, vous pouvez générer des tokens JWT pour tester :

```bash
# Token utilisateur standard
curl http://localhost:3000/api/dev/token?userId=1&role=user

# Token administrateur
curl http://localhost:3000/api/dev/token?userId=3&role=admin
```

### Scripts disponibles
```bash
npm run bis     # Démarrage avec nodemon (dev)
npm start       # Démarrage en production
```

## 🔧 Configuration

### Rate Limiting
- **Routes publiques** : 10 requêtes/seconde
- **Routes d'écriture** : 5 requêtes/5 secondes
- **Personnalisable** dans `server-bis.js`

## 📊 Exemples d'utilisation

### Créer un véhicule
```bash
curl -X POST http://localhost:3000/api/v1/cars \
  -H "Authorization: Bearer TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Peugeot",
    "model": "308",
    "year": 2023,
    "price": 28000
  }'
```

### Rechercher des véhicules
```bash
# Par marque
curl "http://localhost:3000/api/v1/cars?brand=Toyota"

# Par fourchette de prix
curl "http://localhost:3000/api/v1/cars?minPrice=20000&maxPrice=40000"

# Avec pagination
curl "http://localhost:3000/api/v1/cars?page=2&limit=5"
```

### Modifier un véhicule
```bash
curl -X PUT http://localhost:3000/api/v1/cars/1 \
  -H "Authorization: Bearer TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 26000,
    "year": 2024
  }'
```