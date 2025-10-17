# MoodFlow+ 💜

Application web de suivi d'humeur avec analyse météorologique

## 🎯 À propos du projet

MoodFlow+ est une application web moderne qui permet aux utilisateurs de suivre leur humeur au quotidien, d'analyser les tendances et de mieux comprendre leur bien-être mental. L'application intègre les données météorologiques pour identifier les corrélations entre le temps qu'il fait et votre humeur.

## ✨ Fonctionnalités principales

- **Suivi quotidien d'humeur** : Enregistrez votre humeur avec des icônes expressives et des notes personnalisées
- **Intégration météo** : Corrélation automatique entre conditions météorologiques et état émotionnel
- **Vue calendrier** : Visualisez votre humeur sur une semaine ou un mois complet
- **Analyses et statistiques** : Graphiques de tendances, distribution des humeurs et insights personnalisés
- **Tableau de travail** : Organisez vos tâches avec un système de cartes déplaçables
- **Exercices de respiration** : Techniques guidées pour gérer le stress
- **Musique zen** : Lecteur intégré avec playlist relaxante
- **Thème sombre/clair** : Interface adaptable selon vos préférences
- **Design responsive** : Optimisé pour mobile, tablette et desktop

## 🛠️ Technologies utilisées

- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique pour un code robuste
- **Tailwind CSS v4** - Framework CSS moderne
- **shadcn/ui** - Composants UI accessibles
- **Recharts** - Bibliothèque de visualisation de données
- **OpenWeatherMap API** - Données météorologiques en temps réel
- **localStorage** - Persistance des données côté client

## 🚀 Installation et lancement

### Prérequis

- Node.js 18+ installé sur votre machine
- npm ou yarn comme gestionnaire de paquets

### Installation

\`\`\`bash
# Cloner le projet
git clone [url-du-repo]
cd moodflow-plus

# Installer les dépendances
npm install
\`\`\`

### Configuration (optionnel)

Pour activer l'intégration météo en production :

1. Créez un compte gratuit sur [OpenWeatherMap](https://openweathermap.org/api)
2. Obtenez votre clé API
3. Créez un fichier `.env.local` à la racine du projet :
   \`\`\`
   OPENWEATHER_API_KEY=votre_clé_api_ici
   \`\`\`

**Note** : L'application fonctionne avec des données de démonstration si aucune clé API n'est fournie.

### Lancement

\`\`\`bash
# Mode développement
npm run dev

# L'application sera accessible sur http://localhost:3000
\`\`\`

### Build de production

\`\`\`bash
# Créer le build optimisé
npm run build

# Lancer en mode production
npm start
\`\`\`

## 📁 Structure du projet

\`\`\`
moodflow-plus/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Page d'accueil
│   ├── journal/           # Page principale de l'application
│   └── api/               # Routes API (météo)
├── components/            # Composants React réutilisables
│   ├── ui/               # Composants UI de base (shadcn)
│   ├── mood-entry.tsx    # Saisie d'humeur
│   ├── weekly-overview.tsx # Vue calendrier
│   ├── work-board.tsx    # Tableau de travail
│   └── ...
├── lib/                   # Utilitaires et helpers
└── public/               # Fichiers statiques
\`\`\`

## 🎨 Fonctionnalités détaillées

### Suivi d'humeur
- 5 niveaux d'humeur avec icônes expressives
- Notes personnalisées pour chaque entrée
- Tags d'activités pour identifier les facteurs d'influence
- Questions d'aide pour évaluer son humeur

### Intégration météo
- Géolocalisation automatique
- Données en temps réel (température, humidité, vent, visibilité)
- Messages personnalisés selon les conditions météo
- Recherche manuelle de ville

### Visualisations
- Graphique de tendance sur 14 jours
- Distribution des humeurs (camembert)
- Fréquence par type d'humeur (barres)
- Statistiques et moyennes

### Tableau de travail
- Création de cartes de tâches
- Déplacement par glisser-déposer
- Édition et suppression
- Choix de couleurs

## 🔒 Sécurité et confidentialité

- Toutes les données sont stockées localement dans votre navigateur
- Aucune donnée personnelle n'est envoyée à des serveurs externes
- La clé API météo est protégée côté serveur
- Pas de tracking ni d'analytics

## 🌟 Améliorations futures possibles

- Export des données (CSV, PDF)
- Synchronisation cloud optionnelle
- Notifications de rappel
- Partage sécurisé avec un thérapeute
- Analyse prédictive des tendances
- Intégration avec calendriers externes

## 📝 Licence

Projet académique - Hackathon Ynov Montpellier 2025

---

**Prenez soin de votre bien-être mental avec MoodFlow+ 💜**
