import { Center } from './center.model';
import { Specialty } from './specialty.model';
import { Absence } from './absence.model';

export interface Availability {
  id?: string;
  dayOfWeek: number; // 0 = dimanche ... 6 = samedi
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialtyId: string;
  centerId: string;
  specialty?: Specialty;
  center?: Center;
  availabilities?: Availability[];
  absences?: Absence[];
}
