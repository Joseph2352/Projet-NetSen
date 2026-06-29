# database/

Scripts SQL fournis pour satisfaire la consigne du test technique (dossier
`database/` avec script de création des tables + jeu de données d'exemple).

- **schema.sql** — DDL complet (tables, enums, index, clés étrangères),
  généré à partir du schéma Prisma source de vérité
  ([backend/prisma/schema.prisma](../backend/prisma/schema.prisma)) :

  ```bash
  npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script
  ```

- **seed.sql** — jeu de données d'exemple (comptes de test, centres,
  spécialités, médecins, disponibilités, une absence), équivalent SQL de
  [backend/prisma/seed.ts](../backend/prisma/seed.ts). Mot de passe commun
  des comptes de test : `Password123`.
- **database-schema.svg** — schéma entité-relation du modèle de données
  (tables, clés primaires/étrangères, cardinalités des relations, énumérations).

Les deux fichiers ont été testés sur une base PostgreSQL 17 vierge (exécution
sans erreur, dans cet ordre : `schema.sql` puis `seed.sql`).

> En usage normal (dev/déploiement), le projet gère le schéma directement via
> Prisma (`npx prisma db push`) et insère les données de démo automatiquement
> au démarrage du serveur — voir le [README principal](../README.md). Ce
> dossier est une vue SQL statique du même schéma, fournie pour la revue.
