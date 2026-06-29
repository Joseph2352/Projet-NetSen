import { AbsenceReason, PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/** Plages de travail classiques : lundi→vendredi, 09:00-12:00 et 14:00-17:00. */
function weekdayAvailabilities() {
  const blocks: { dayOfWeek: number; startTime: string; endTime: string }[] = [];
  for (let day = 1; day <= 5; day++) {
    blocks.push({ dayOfWeek: day, startTime: '09:00', endTime: '12:00' });
    blocks.push({ dayOfWeek: day, startTime: '14:00', endTime: '17:00' });
  }
  return blocks;
}

async function main() {
  // Lancé automatiquement au démarrage du serveur : on ne seed que si la
  // base est vide, pour ne jamais effacer des données réelles au redémarrage.
  const existing = await prisma.user.findFirst();
  if (existing) {
    console.log('Seed: des données existent déjà, aucune action.');
    return;
  }
  console.log('Seed: base vide, création des données de test…');

  // --- Utilisateurs de test ---
  const passwordHash = await bcrypt.hash('Password123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@medirdv.com',
      password: passwordHash,
      fullName: 'Administrateur MediRDV',
      role: Role.ADMIN,
    },
  });
  await prisma.user.create({
    data: {
      email: 'patient@medirdv.com',
      password: passwordHash,
      fullName: 'Jean Patient',
      role: Role.PATIENT,
    },
  });

  // --- Centres ---
  const centreNord = await prisma.center.create({
    data: {
      name: 'Centre Médical Nord',
      address: '12 Avenue de la République, Conakry',
      contact: '+224 600 00 00 01',
    },
  });
  const centreSud = await prisma.center.create({
    data: {
      name: 'Clinique du Sud',
      address: '45 Rue du Commerce, Conakry',
      contact: '+224 600 00 00 02',
    },
  });

  // --- Spécialités ---
  const generaliste = await prisma.specialty.create({
    data: { name: 'Médecine générale' },
  });
  const cardiologie = await prisma.specialty.create({
    data: { name: 'Cardiologie' },
  });
  const dermatologie = await prisma.specialty.create({
    data: { name: 'Dermatologie' },
  });

  // --- Médecins (avec disponibilités) ---
  const drTraore = await prisma.doctor.create({
    data: {
      firstName: 'Aminata',
      lastName: 'Traoré',
      specialtyId: generaliste.id,
      centerId: centreNord.id,
      availabilities: { create: weekdayAvailabilities() },
    },
  });

  await prisma.doctor.create({
    data: {
      firstName: 'Mamadou',
      lastName: 'Diallo',
      specialtyId: cardiologie.id,
      centerId: centreNord.id,
      availabilities: { create: weekdayAvailabilities() },
    },
  });

  await prisma.doctor.create({
    data: {
      firstName: 'Fatoumata',
      lastName: 'Camara',
      specialtyId: dermatologie.id,
      centerId: centreSud.id,
      availabilities: { create: weekdayAvailabilities() },
    },
  });

  await prisma.doctor.create({
    data: {
      firstName: 'Ibrahima',
      lastName: 'Bah',
      specialtyId: generaliste.id,
      centerId: centreSud.id,
      availabilities: { create: weekdayAvailabilities() },
    },
  });

  // --- Exemple d'absence (congés) pour illustrer l'impact sur les créneaux ---
  const start = new Date();
  start.setUTCDate(start.getUTCDate() + 2);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 3);
  await prisma.absence.create({
    data: {
      doctorId: drTraore.id,
      startDate: new Date(start.toISOString().slice(0, 10) + 'T00:00:00.000Z'),
      endDate: new Date(end.toISOString().slice(0, 10) + 'T23:59:59.000Z'),
      reason: AbsenceReason.VACATION,
      note: 'Congés annuels',
    },
  });

  console.log('Seed terminé ✅');
  console.log('Comptes de test :');
  console.log('  admin@medirdv.com / Password123 (ADMIN)');
  console.log('  patient@medirdv.com / Password123 (PATIENT)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
