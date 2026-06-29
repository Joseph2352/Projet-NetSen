# MediRDV — Backend (API)

API REST de l'application **MediRDV**, développée avec **NestJS** + **Prisma** + **PostgreSQL**.

> Vue d'ensemble du projet (frontend inclus) : voir le [README principal](../README.md).

## Stack

- **NestJS 11** (TypeScript) — modules, controllers, services, guards, pipes
- **Prisma 6** — ORM, schéma type-safe, synchronisation via `db push`
- **PostgreSQL** — base de données relationnelle
- **JWT** (Passport) + **bcrypt** — authentification et hash des mots de passe
- **class-validator** / **class-transformer** — validation des DTO
- **Jest** — tests unitaires (logique de créneaux)

## Structure

```text
src/
├── common/         # guards, decorators et types transversaux (JwtAuthGuard, RolesGuard, @Roles, @CurrentUser)
├── auth/           # inscription / connexion / stratégie JWT
├── centers/        # CRUD centres médicaux
├── specialties/    # CRUD spécialités
├── doctors/        # CRUD médecins + disponibilités hebdomadaires
├── absences/       # gestion des absences (admin)
├── appointments/   # calcul des créneaux, réservation, annulation
└── prisma/         # service Prisma (injectable, @Global)
prisma/
├── schema.prisma   # modèle de données
└── seed.ts         # jeu de données de démo
```

## Installation

```bash
npm install
cp .env.example .env      # puis ajuster DATABASE_URL / JWT_SECRET si besoin
```

## Base de données

```bash
npm run prisma:push       # synchronise les tables sur le schéma (sans migration SQL)
```

> `npm run db:seed` (comptes de test, centres, médecins…) est lancé automatiquement
> avant le serveur par `start:dev`/`start:prod`, et ne fait rien si la base contient déjà des données.

## Lancer le serveur

```bash
npm run start:dev         # seed si besoin + mode watch — http://localhost:3000/api
npm run start:prod        # seed si besoin + mode production (après npm run build)
```

## Tests

```bash
npm run test              # tests unitaires (ex. slots.util.spec.ts)
npm run test:cov          # avec couverture
npm run test:e2e          # tests end-to-end
```

## Lint / format

```bash
npm run lint
npm run format
```
