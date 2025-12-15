# Portail Habitat App

Application mobile React Native pour la gestion des leads et appels d'offres d'artisans.

## 🚀 Installation et lancement

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn
- Expo CLI (`npm install -g @expo/cli`)
- Application Expo Go sur votre téléphone

### 1. Cloner le projet
```bash
git clone https://github.com/magicniclus/Portail-Habitat-App.git
cd Portail-Habitat-App
```

### 2. Installer les dépendances
```bash
npm install
# ou
yarn install
```

### 3. Configuration Firebase
1. Copiez le fichier d'exemple :
```bash
cp .env.example .env
```

2. Éditez le fichier `.env` avec vos vraies clés Firebase :
```env
EXPO_PUBLIC_FIREBASE_API_KEY=votre_api_key_ici
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_auth_domain_ici
EXPO_PUBLIC_FIREBASE_DATABASE_URL=votre_database_url_ici
EXPO_PUBLIC_FIREBASE_PROJECT_ID=votre_project_id_ici
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_storage_bucket_ici
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_messaging_sender_id_ici
EXPO_PUBLIC_FIREBASE_APP_ID=votre_app_id_ici
```

### 4. Lancer le projet
```bash
npx expo start
```

### 5. Tester sur votre téléphone avec Expo Go

#### Sur iOS :
1. Téléchargez l'app **Expo Go** depuis l'App Store
2. Ouvrez l'app Expo Go
3. Scannez le QR code affiché dans votre terminal

#### Sur Android :
1. Téléchargez l'app **Expo Go** depuis le Google Play Store
2. Ouvrez l'app Expo Go
3. Scannez le QR code affiché dans votre terminal

## 📱 Fonctionnalités

- **Authentification** : Connexion sécurisée avec Firebase Auth
- **Gestion des leads** : Visualisation et gestion des leads assignés
- **Appels d'offres** : Filtrage des leads par source (bought/priority)
- **Détail contact** : Page détaillée avec modification de statut
- **Actions rapides** : Boutons Email et Appel directs
- **Interface responsive** : Optimisée pour mobile

## 🏗️ Architecture

```
/components
  ├── BottomNavigation.js      # Navigation Leads/Appels d'offres
  ├── ContactBottomNavigation.js # Navigation Email/Appeler
  ├── Header.js                # En-tête avec logo et menu
  ├── LeadCard.js             # Carte d'affichage des leads
  └── ContactDetail.js        # Page détail du contact
/assets
  └── icon.png                # Icône de l'application
App.js                        # Composant principal
firebase.js                   # Configuration Firebase
```

## 🔧 Variables d'environnement

Le projet utilise les variables d'environnement suivantes (préfixe `EXPO_PUBLIC_` requis pour Expo) :

- `EXPO_PUBLIC_FIREBASE_API_KEY` : Clé API Firebase
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` : Domaine d'authentification
- `EXPO_PUBLIC_FIREBASE_DATABASE_URL` : URL de la base de données
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID` : ID du projet Firebase
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` : Bucket de stockage
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` : ID de l'expéditeur de messages
- `EXPO_PUBLIC_FIREBASE_APP_ID` : ID de l'application Firebase

## 🔒 Sécurité

- Le fichier `.env` est exclu du versioning Git
- Les clés Firebase sont stockées dans des variables d'environnement
- Utilisez `.env.example` comme modèle pour la configuration

## 📋 Scripts disponibles

- `npm start` : Lance le serveur de développement Expo
- `npm run android` : Lance sur émulateur Android
- `npm run ios` : Lance sur simulateur iOS
- `npm run web` : Lance la version web

## 🛠️ Technologies utilisées

- **React Native** : Framework mobile
- **Expo** : Plateforme de développement
- **Firebase** : Backend (Auth + Firestore)
- **React Native Vector Icons** : Icônes
