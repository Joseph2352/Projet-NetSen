# MediRDV — Frontend

Application **Angular 21** (standalone components + signals) de l'application **MediRDV**.

> Vue d'ensemble du projet (backend inclus) : voir le [README principal](../README.md).

## Stack

- **Angular 21** — composants standalone, signals (`signal`/`computed`), nouvelle syntaxe de contrôle (`@if`/`@for`)
- **Routing** — routes lazy-loadées (`loadComponent`), guards fonctionnels (`CanActivateFn`)
- **HttpClient** — intercepteur fonctionnel (`HttpInterceptorFn`) pour injecter le token JWT et gérer les 401
- **Reactive Forms** — formulaires de connexion / inscription / administration
- **SCSS** — design system minimal centralisé dans `styles.scss`
- **Vitest** — tests unitaires

## Structure

```text
src/app/
├── core/                 # socle transversal
│   ├── guards/             # authGuard, adminGuard
│   ├── interceptors/       # authInterceptor (JWT + gestion 401)
│   ├── models/             # interfaces TypeScript (barrel index.ts)
│   └── services/           # appels API (auth, centers, specialties, doctors, absences, appointments)
└── features/             # pages par domaine métier
    ├── auth/                # login, register
    ├── booking/             # parcours de réservation (centre → spécialité → médecin → créneau)
    ├── appointments/        # mes rendez-vous
    └── admin/               # console d'administration
```

## Installation

```bash
npm install
```

## Développement

```bash
npm start            # ng serve — http://localhost:4200
```

L'environnement de développement (`environment.development.ts`) pointe vers l'API sur `http://localhost:3000/api` — le backend doit être lancé en parallèle (voir [backend/README.md](../backend/README.md)).

## Build production

```bash
npm run build         # artefacts dans dist/
```

## Tests

```bash
npm test              # tests unitaires (Vitest)
```
