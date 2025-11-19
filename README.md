# Olympic Games Application

Application Angular pour visualiser les données des Jeux Olympiques avec des graphiques interactifs.

## Prérequis

- Node.js (version 18 ou supérieure)
- npm (inclus avec Node.js)

## Installation

1. Cloner le projet
2. Installer les dépendances :
```bash
npm install --legacy-peer-deps
```

## Lancer l'application

```bash
npm start
```

L'application sera accessible sur `http://localhost:4200/`

## Architecture du projet

```
src/
├── app/
│   ├── components/          # Composants réutilisables
│   │   ├── area-chart/      # Graphique de type area (ApexCharts)
│   │   ├── pie-chart/       # Graphique circulaire (ApexCharts)
│   │   ├── card/            # Carte d'affichage
│   │   ├── title/           # Composant titre générique
│   │   ├── country-data/    # Affichage des données pays (page d'accueil)
│   │   └── country-data-detail/ # Détails d'un pays
│   ├── pages/               # Pages de l'application
│   │   ├── home/            # Page d'accueil
│   │   ├── detail/          # Page de détails d'un pays
│   │   └── not-found/       # Page 404
│   ├── core/                # Logique métier
│   │   ├── services/        # Services (Olympic, Country)
│   │   ├── models/          # Interfaces TypeScript
│   │   └── pipes/           # Pipes de transformation
│   └── app-routing.module.ts # Configuration des routes
└── assets/
    └── mock/
        └── olympic.json     # Données des JO
```

## Fonctionnalités

### Page d'accueil
- Affichage du nombre de JOs et de pays participants
- Graphique circulaire des médailles par pays
- Navigation vers les détails au clic sur un pays

### Page de détails
- Statistiques détaillées d'un pays (nombre d'entrées, total médailles, total athlètes)
- Graphique area chart de l'évolution des médailles par année
- Bouton retour vers la page d'accueil

## Technologies utilisées

- **Angular 18** - Framework frontend
- **ApexCharts** - Bibliothèque de graphiques
- **TailwindCSS** - Framework CSS
- **RxJS** - Programmation réactive
- **TypeScript** - Langage de programmation

## Services

- **OlympicService** : Chargement et gestion des données olympiques
- **CountryService** : Récupération des détails d'un pays par ID

## Build de production

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`.
