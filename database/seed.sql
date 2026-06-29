-- Jeu de données d'exemple pour MediRDV (correspond à backend/prisma/seed.ts)
-- Mot de passe commun pour les comptes de test : Password123

-- Utilisateurs de test
INSERT INTO "User" (id, email, password, "fullName", role, "createdAt", "updatedAt") VALUES
  ('80386c3b-0973-40e1-b04f-06c33255a49e', 'admin@medirdv.com', '$2b$10$xy0W1R5tyxxE3BQ1KhA3Ie1eK9qjw4/sqfoggHctQnu539pV4hQpq', 'Administrateur MediRDV', 'ADMIN', NOW(), NOW()),
  ('b8f7131c-5400-4717-8650-fdc5cb23da61', 'patient@medirdv.com', '$2b$10$xy0W1R5tyxxE3BQ1KhA3Ie1eK9qjw4/sqfoggHctQnu539pV4hQpq', 'Jean Patient', 'PATIENT', NOW(), NOW());

-- Centres médicaux
INSERT INTO "Center" (id, name, address, contact, "createdAt", "updatedAt") VALUES
  ('a6eaf5e0-1101-4582-a561-de5586ca4768', 'Centre Médical Nord', '12 Avenue de la République, Conakry', '+224 600 00 00 01', NOW(), NOW()),
  ('1cc82384-8ddf-4222-b074-89c4a6ce0e79', 'Clinique du Sud', '45 Rue du Commerce, Conakry', '+224 600 00 00 02', NOW(), NOW());

-- Spécialités
INSERT INTO "Specialty" (id, name, "createdAt", "updatedAt") VALUES
  ('825cde71-7bb5-4b0c-83c4-656d17b97602', 'Médecine générale', NOW(), NOW()),
  ('7c6983e8-873d-4ea1-8d4f-14eadbe582b0', 'Cardiologie', NOW(), NOW()),
  ('779d41cd-2db6-4401-a618-b3660504beb9', 'Dermatologie', NOW(), NOW());

-- Médecins
INSERT INTO "Doctor" (id, "firstName", "lastName", "specialtyId", "centerId", "createdAt", "updatedAt") VALUES
  ('f93c6ede-a86e-4b0b-b2ff-795682e36f98', 'Aminata', 'Traoré', '825cde71-7bb5-4b0c-83c4-656d17b97602', 'a6eaf5e0-1101-4582-a561-de5586ca4768', NOW(), NOW()),
  ('17f3243e-9cd0-48aa-80cb-3be696929449', 'Mamadou', 'Diallo', '7c6983e8-873d-4ea1-8d4f-14eadbe582b0', 'a6eaf5e0-1101-4582-a561-de5586ca4768', NOW(), NOW()),
  ('f1525d7c-f3c6-405a-acb2-5ff3681cb88f', 'Fatoumata', 'Camara', '779d41cd-2db6-4401-a618-b3660504beb9', '1cc82384-8ddf-4222-b074-89c4a6ce0e79', NOW(), NOW()),
  ('76227d62-7a63-4adc-aff2-d9776287ef85', 'Ibrahima', 'Bah', '825cde71-7bb5-4b0c-83c4-656d17b97602', '1cc82384-8ddf-4222-b074-89c4a6ce0e79', NOW(), NOW());

-- Disponibilités hebdomadaires (lundi-vendredi, 09:00-12:00 et 14:00-17:00)
INSERT INTO "Availability" (id, "doctorId", "dayOfWeek", "startTime", "endTime") VALUES
  ('3a7d0875-c064-4b35-a581-64fa93a8c802', 'f93c6ede-a86e-4b0b-b2ff-795682e36f98', 1, '09:00', '12:00'),
  ('31d036b9-41ec-4d91-adc9-0f8e5cbe5cac', 'f93c6ede-a86e-4b0b-b2ff-795682e36f98', 1, '14:00', '17:00'),
  ('a8d53df9-28a1-4c00-a304-c05997274b32', 'f93c6ede-a86e-4b0b-b2ff-795682e36f98', 2, '09:00', '12:00'),
  ('071ef720-7f8f-4b18-bd29-53148dc1a411', 'f93c6ede-a86e-4b0b-b2ff-795682e36f98', 2, '14:00', '17:00'),
  ('b3d24516-42c2-41ff-bf54-b0a41cfa46fc', 'f93c6ede-a86e-4b0b-b2ff-795682e36f98', 3, '09:00', '12:00'),
  ('fe48494d-1a6d-4b40-85f2-d1e7a84bc6fb', 'f93c6ede-a86e-4b0b-b2ff-795682e36f98', 3, '14:00', '17:00'),
  ('a8736ab6-9f8f-48fa-91b7-d53a4fe9bf6b', 'f93c6ede-a86e-4b0b-b2ff-795682e36f98', 4, '09:00', '12:00'),
  ('f4c76ad3-b7bf-4322-a53f-44bc1e5fa264', 'f93c6ede-a86e-4b0b-b2ff-795682e36f98', 4, '14:00', '17:00'),
  ('d0c6e3d2-42c9-4ed3-9476-856a45fc8a40', 'f93c6ede-a86e-4b0b-b2ff-795682e36f98', 5, '09:00', '12:00'),
  ('abc1b8c3-70c0-41cd-83bf-153988d29bb6', 'f93c6ede-a86e-4b0b-b2ff-795682e36f98', 5, '14:00', '17:00'),
  ('cb493452-dc54-4a67-a6a9-b4fa9405e698', '17f3243e-9cd0-48aa-80cb-3be696929449', 1, '09:00', '12:00'),
  ('2da51306-095c-4bd6-af61-d414fcaec931', '17f3243e-9cd0-48aa-80cb-3be696929449', 1, '14:00', '17:00'),
  ('b60ef8e8-33f8-4a28-9464-7652450172b8', '17f3243e-9cd0-48aa-80cb-3be696929449', 2, '09:00', '12:00'),
  ('782adc0f-e9e3-4303-a8e7-32673df00057', '17f3243e-9cd0-48aa-80cb-3be696929449', 2, '14:00', '17:00'),
  ('f6f60896-9dc4-48b4-8d32-cee98d327257', '17f3243e-9cd0-48aa-80cb-3be696929449', 3, '09:00', '12:00'),
  ('414b3255-4716-4163-ba82-806440f52a00', '17f3243e-9cd0-48aa-80cb-3be696929449', 3, '14:00', '17:00'),
  ('ec3bdf72-d10e-45dc-9bd8-e2419f0f6640', '17f3243e-9cd0-48aa-80cb-3be696929449', 4, '09:00', '12:00'),
  ('850e768c-71e9-4dc6-a454-b06913765eea', '17f3243e-9cd0-48aa-80cb-3be696929449', 4, '14:00', '17:00'),
  ('854d119b-6693-40ed-9d11-60907e6a56fa', '17f3243e-9cd0-48aa-80cb-3be696929449', 5, '09:00', '12:00'),
  ('1425ac78-5cf8-4d17-9cd0-0d87ea8b48b1', '17f3243e-9cd0-48aa-80cb-3be696929449', 5, '14:00', '17:00'),
  ('3e3d33d9-72b5-41f6-b9ee-3e78675d0aa7', 'f1525d7c-f3c6-405a-acb2-5ff3681cb88f', 1, '09:00', '12:00'),
  ('21843812-f5ab-4706-a4bc-15648f30dba4', 'f1525d7c-f3c6-405a-acb2-5ff3681cb88f', 1, '14:00', '17:00'),
  ('69cd0120-af97-44f0-8504-ac520e70c5a1', 'f1525d7c-f3c6-405a-acb2-5ff3681cb88f', 2, '09:00', '12:00'),
  ('dd9c176f-1cfd-4597-bfd2-8593c532362b', 'f1525d7c-f3c6-405a-acb2-5ff3681cb88f', 2, '14:00', '17:00'),
  ('42c9c78c-c044-4e79-9263-6d6ca4855e2c', 'f1525d7c-f3c6-405a-acb2-5ff3681cb88f', 3, '09:00', '12:00'),
  ('2d12a082-7424-4f2d-b442-c589ba15b531', 'f1525d7c-f3c6-405a-acb2-5ff3681cb88f', 3, '14:00', '17:00'),
  ('103ee255-0170-442d-841f-429912369535', 'f1525d7c-f3c6-405a-acb2-5ff3681cb88f', 4, '09:00', '12:00'),
  ('f4e5463f-4870-491b-aeac-6d7a93555326', 'f1525d7c-f3c6-405a-acb2-5ff3681cb88f', 4, '14:00', '17:00'),
  ('83717ca3-ecc6-4fa2-afff-557ff46200ec', 'f1525d7c-f3c6-405a-acb2-5ff3681cb88f', 5, '09:00', '12:00'),
  ('0160b093-a227-42a6-80ec-c2aa423388fc', 'f1525d7c-f3c6-405a-acb2-5ff3681cb88f', 5, '14:00', '17:00'),
  ('2f43b544-c9d6-44ae-b667-c3ce0632b5fa', '76227d62-7a63-4adc-aff2-d9776287ef85', 1, '09:00', '12:00'),
  ('2a50a608-498b-4693-b5a3-633cc3977d9b', '76227d62-7a63-4adc-aff2-d9776287ef85', 1, '14:00', '17:00'),
  ('f40d01ee-570d-4359-8a30-91610e1065a1', '76227d62-7a63-4adc-aff2-d9776287ef85', 2, '09:00', '12:00'),
  ('ba63f492-e7c0-4aee-8f6f-3ff7520720c0', '76227d62-7a63-4adc-aff2-d9776287ef85', 2, '14:00', '17:00'),
  ('d7659f9d-cd35-4571-bd5e-c9221e8ac750', '76227d62-7a63-4adc-aff2-d9776287ef85', 3, '09:00', '12:00'),
  ('d2624343-b253-4a86-8fab-e2f4b146935d', '76227d62-7a63-4adc-aff2-d9776287ef85', 3, '14:00', '17:00'),
  ('31c36caf-046f-4241-b8f1-996701904fbb', '76227d62-7a63-4adc-aff2-d9776287ef85', 4, '09:00', '12:00'),
  ('65ec3517-ddb4-448a-9522-48a6252b6427', '76227d62-7a63-4adc-aff2-d9776287ef85', 4, '14:00', '17:00'),
  ('2eca4845-60c2-4bd4-995c-126322e689b0', '76227d62-7a63-4adc-aff2-d9776287ef85', 5, '09:00', '12:00'),
  ('286cbe90-4591-45fc-acf9-79676c5ecb33', '76227d62-7a63-4adc-aff2-d9776287ef85', 5, '14:00', '17:00');

-- Exemple d'absence (congés) pour illustrer l'impact sur les créneaux
INSERT INTO "Absence" (id, "doctorId", "startDate", "endDate", reason, note, "createdAt") VALUES
  ('22c63d81-b7e6-4b5b-86c9-e9d28d7baf60', 'f93c6ede-a86e-4b0b-b2ff-795682e36f98', NOW() + INTERVAL '2 days', NOW() + INTERVAL '5 days', 'VACATION', 'Congés annuels', NOW());

