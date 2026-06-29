# MediRDV — Application de prise de rendez-vous médical

Mini-application full-stack de prise de rendez-vous médical : choix d'un centre,
d'une spécialité, d'un médecin, puis réservation d'un créneau disponible en tenant
compte des **disponibilités** et des **absences** des médecins.

Réalisé dans le cadre du test technique **Développeur(se) Fullstack** (Netsen Group).

---

## ✨ Fonctionnalités

**Parcours patient (réservation)**
- Choix d'un **centre médical**
- Choix d'une **spécialité** (filtrée selon les médecins du centre)
- Affichage des **médecins disponibles** pour la spécialité
- Sélection d'une **date** et réservation d'un **créneau** (pas de 30 min)
- Les créneaux tiennent compte des disponibilités, des **absences** du médecin et des **rendez-vous déjà pris**
- Consultation de ses rendez-vous et **annulation**

**Administration**
- CRUD **centres**, **spécialités**, **médecins** (avec leurs disponibilités hebdomadaires)
- Gestion des **absences** (maladie / congés / autre), prises en compte automatiquement dans les créneaux
- Vue de l'ensemble des rendez-vous

**Authentification**
- Inscription / connexion **JWT**, deux rôles : `ADMIN` et `PATIENT`
- Protection des routes côté API (guards) et côté front (route guards + intercepteur)

---

## 🧱 Choix techniques

| Couche | Technologie | Pourquoi |
|-------|-------------|----------|
| Backend | **NestJS** (Node.js + TypeScript) | Architecture modulaire, injection de dépendances, validation des DTO → code structuré et testable |
| ORM | **Prisma** | Schéma typé, synchronisation directe via `db push`, requêtes type-safe |
| Base de données | **PostgreSQL** | Relationnel, robuste, gratuit à déployer |
| Frontend | **Angular 21** (standalone + signals) | Demandé par l'énoncé ; composants autonomes, état réactif via signals |
| Auth | **JWT** + Passport + bcrypt | Standard, sans état côté serveur |

### Points d'architecture notables
- **Séparation claire** par domaine métier (un module Nest par entité : `auth`, `centers`, `specialties`, `doctors`, `absences`, `appointments`).
- **Validation centralisée** via `class-validator` + `ValidationPipe` global (`whitelist` activé).
- **Logique de créneaux isolée** dans une fonction pure ([slots.util.ts](backend/src/appointments/slots.util.ts)), testée unitairement.
- **Sécurité de la réservation** : le serveur **revérifie** la disponibilité d'un créneau avant de l'enregistrer (on ne fait pas confiance au client), dans une **transaction** pour éviter les doubles réservations.
- **Gestion du temps en UTC** de bout en bout pour éviter les décalages de fuseau entre dev et production.

---

## 📁 Structure du dépôt

```
MediRDV/
├── backend/            # API NestJS + Prisma
│   ├── src/
│   │   ├── common/         # transversal : guards, decorators, types partagés
│   │   ├── auth/           # authentification (JWT, stratégie, login/register)
│   │   ├── centers/        # CRUD centres
│   │   ├── specialties/    # CRUD spécialités
│   │   ├── doctors/        # CRUD médecins + disponibilités
│   │   ├── absences/       # gestion des absences
│   │   ├── appointments/   # créneaux + réservation/annulation
│   │   └── prisma/         # service Prisma (DI)
│   └── prisma/
│       ├── schema.prisma   # modèle de données
│       └── seed.ts         # jeu de données de démo
├── frontend/           # application Angular
│   └── src/app/
│       ├── core/                 # socle transversal
│       │   ├── guards/             # authGuard, adminGuard
│       │   ├── interceptors/       # authInterceptor (JWT + 401)
│       │   ├── models/             # interfaces (barrel index.ts)
│       │   └── services/           # appels API (auth, centers, doctors…)
│       └── features/             # pages par domaine
│           ├── auth/               # login, register
│           ├── booking/            # parcours de réservation
│           ├── appointments/       # mes rendez-vous
│           └── admin/              # console d'administration
├── database/           # schema.sql + seed.sql (cf. database/README.md)
└── docker-compose.yml  # PostgreSQL pour le développement local
```

---

## 🚀 Installation & exécution locale

### Prérequis
- Node.js ≥ 20
- Docker (pour PostgreSQL) **ou** une instance PostgreSQL existante

### 1) Base de données

Avec Docker (recommandé) :
```bash
docker compose up -d db
```
Cela démarre PostgreSQL sur `localhost:5432` (base `medirdv`, utilisateur/mot de passe `medirdv`).

> Sans Docker : créez une base PostgreSQL et adaptez `DATABASE_URL` dans `backend/.env`.

### 2) Backend (API)
```bash
cd backend
cp .env.example .env          # puis ajustez si besoin
npm install
npm run prisma:push            # crée/synchronise les tables
npm run start:dev             # API sur http://localhost:3000/api
```

> Les données de démo (comptes de test, centres, médecins…) sont insérées
> automatiquement au premier démarrage si la base est vide (`npm run db:seed`
> est lancé avant le serveur). Les démarrages suivants ne les recréent pas.

### 3) Frontend
```bash
cd frontend
npm install
npm start                     # application sur http://localhost:4200
```

L'application est alors accessible sur **http://localhost:4200**.

---

## 👤 Utilisateurs de test

Créés automatiquement au premier démarrage du serveur — mot de passe commun : **`Password123`**

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Administrateur | `admin@medirdv.com` | `Password123` |
| Patient | `patient@medirdv.com` | `Password123` |

---

## 🗄️ Base de données

Le schéma est géré par **Prisma**, synchronisé directement sur la base via `db push`
(pas de fichiers de migration SQL à maintenir).

```bash
cd backend
npx prisma db push          # crée/synchronise les tables sur le schéma
```

> Le modèle de données complet est décrit dans
> [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma). Les données de
> démo sont insérées automatiquement au démarrage du serveur (voir section précédente).

Le dossier [`database/`](database/) fournit aussi une version SQL statique du même
schéma (`schema.sql`) et un jeu de données d'exemple (`seed.sql`), générés à partir
du schéma Prisma — voir [`database/README.md`](database/README.md).

---

## 🔌 Aperçu de l'API

Toutes les routes sont préfixées par `/api`. Les routes (hors `auth`) nécessitent un token JWT
(`Authorization: Bearer <token>`). Les écritures de gestion sont réservées au rôle `ADMIN`.

| Méthode | Route | Accès | Description |
|--------|-------|-------|-------------|
| POST | `/auth/register` | public | Inscription (patient) |
| POST | `/auth/login` | public | Connexion → token JWT |
| GET | `/centers` | connecté | Liste des centres |
| POST/PUT/DELETE | `/centers/...` | admin | Gestion des centres |
| GET | `/specialties?centerId=` | connecté | Spécialités (filtrables par centre) |
| GET | `/doctors?specialtyId=&centerId=` | connecté | Médecins (filtrables) |
| POST/PUT/DELETE | `/doctors/...` | admin | Gestion des médecins |
| GET/POST/DELETE | `/absences` | admin | Gestion des absences |
| GET | `/appointments/slots?doctorId=&date=` | connecté | Créneaux disponibles |
| POST | `/appointments` | connecté | Réserver un créneau |
| GET | `/appointments/me` | connecté | Mes rendez-vous |
| PATCH | `/appointments/:id/cancel` | connecté | Annuler un rendez-vous |

---

## 🧠 Règles métier clés

- Un **médecin** appartient à **un centre** et a **une spécialité**.
- Une **spécialité** peut être rattachée à **plusieurs médecins**.
- Les créneaux réservables sont calculés à partir des **plages de disponibilité hebdomadaires** du médecin (pas de 30 min), desquelles on retire :
  - les jours/périodes d'**absence** (maladie, congés, autre),
  - les créneaux **déjà réservés**,
  - les créneaux **passés**.
- Une réservation est revalidée côté serveur et protégée contre la **double réservation**.

---

## 🧪 Tests

Tests unitaires de la logique de créneaux (génération, prise en compte des absences) :
```bash
cd backend
npm test
```

---

## 📝 Licence

Projet réalisé à des fins d'évaluation technique.
