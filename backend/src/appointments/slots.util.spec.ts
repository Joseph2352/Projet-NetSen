import {
  generateDaySlots,
  isDoctorAbsentOn,
  formatSlotLabel,
} from './slots.util';

describe('slots.util', () => {
  // 2026-06-29 est un lundi (dayOfWeek = 1).
  const monday = new Date('2026-06-29T00:00:00.000Z');

  describe('generateDaySlots', () => {
    it('génère des créneaux de 30 min sur la plage du jour', () => {
      const slots = generateDaySlots(monday, [
        { dayOfWeek: 1, startTime: '09:00', endTime: '11:00' },
      ]);
      // 09:00→11:00 = 4 créneaux de 30 min.
      expect(slots).toHaveLength(4);
      expect(formatSlotLabel(slots[0].start)).toBe('09:00');
      expect(formatSlotLabel(slots[3].start)).toBe('10:30');
      expect(formatSlotLabel(slots[3].end)).toBe('11:00');
    });

    it('ignore les plages qui ne correspondent pas au jour de la semaine', () => {
      const slots = generateDaySlots(monday, [
        { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' }, // mardi
      ]);
      expect(slots).toHaveLength(0);
    });

    it('gère plusieurs plages dans la même journée et les trie', () => {
      const slots = generateDaySlots(monday, [
        { dayOfWeek: 1, startTime: '14:00', endTime: '15:00' },
        { dayOfWeek: 1, startTime: '09:00', endTime: '10:00' },
      ]);
      expect(slots).toHaveLength(4);
      expect(formatSlotLabel(slots[0].start)).toBe('09:00');
      expect(formatSlotLabel(slots[2].start)).toBe('14:00');
    });
  });

  describe('isDoctorAbsentOn', () => {
    it('détecte une absence couvrant la date', () => {
      const absent = isDoctorAbsentOn(monday, [
        {
          startDate: new Date('2026-06-28T00:00:00.000Z'),
          endDate: new Date('2026-06-30T23:59:59.000Z'),
        },
      ]);
      expect(absent).toBe(true);
    });

    it('retourne false hors période d’absence', () => {
      const absent = isDoctorAbsentOn(monday, [
        {
          startDate: new Date('2026-07-01T00:00:00.000Z'),
          endDate: new Date('2026-07-05T23:59:59.000Z'),
        },
      ]);
      expect(absent).toBe(false);
    });
  });
});
