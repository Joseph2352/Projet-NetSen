/**
 * Logique pure de génération des créneaux, isolée du reste pour être
 * facilement testable unitairement (sans base de données).
 *
 * Choix d'implémentation : tous les calculs se font en UTC afin d'éviter
 * les décalages de fuseau entre la machine de dev et le serveur déployé.
 * Une plage "09:00-17:00" correspond donc à des créneaux exprimés en UTC,
 * et l'étiquette renvoyée au frontend ("09:00") reste cohérente.
 */

export const SLOT_DURATION_MINUTES = 30;

export interface Slot {
  start: Date;
  end: Date;
}

export interface AvailabilityBlock {
  dayOfWeek: number; // 0 = dimanche ... 6 = samedi
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}

export interface AbsencePeriod {
  startDate: Date;
  endDate: Date;
}

function parseHHmm(value: string): [number, number] {
  const [h, m] = value.split(':').map(Number);
  return [h, m];
}

/**
 * Génère tous les créneaux théoriques d'un médecin pour une date donnée,
 * à partir de ses plages de disponibilité hebdomadaires.
 */
export function generateDaySlots(
  date: Date,
  availabilities: AvailabilityBlock[],
  slotMinutes: number = SLOT_DURATION_MINUTES,
): Slot[] {
  const dayOfWeek = date.getUTCDay();
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const slotMs = slotMinutes * 60_000;

  const slots: Slot[] = [];
  for (const block of availabilities) {
    if (block.dayOfWeek !== dayOfWeek) {
      continue;
    }
    const [sh, sm] = parseHHmm(block.startTime);
    const [eh, em] = parseHHmm(block.endTime);
    const endMs = Date.UTC(year, month, day, eh, em);
    let cursor = Date.UTC(year, month, day, sh, sm);

    while (cursor + slotMs <= endMs) {
      slots.push({ start: new Date(cursor), end: new Date(cursor + slotMs) });
      cursor += slotMs;
    }
  }

  return slots.sort((a, b) => a.start.getTime() - b.start.getTime());
}

/** Indique si le médecin est en absence (toute la journée) à la date donnée. */
export function isDoctorAbsentOn(date: Date, absences: AbsencePeriod[]): boolean {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const dayStart = Date.UTC(year, month, day, 0, 0, 0);
  const dayEnd = Date.UTC(year, month, day, 23, 59, 59);

  return absences.some(
    (a) => a.startDate.getTime() <= dayEnd && a.endDate.getTime() >= dayStart,
  );
}

/** Étiquette "HH:mm" (en UTC) d'un instant, pour l'affichage côté frontend. */
export function formatSlotLabel(date: Date): string {
  const h = String(date.getUTCHours()).padStart(2, '0');
  const m = String(date.getUTCMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}
