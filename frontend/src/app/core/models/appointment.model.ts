import { Doctor } from './doctor.model';

export type AppointmentStatus = 'BOOKED' | 'CANCELLED';

export interface Slot {
  start: string; // ISO
  end: string; // ISO
  label: string; // "HH:mm"
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  doctor?: Doctor;
  patient?: { id: string; fullName: string; email: string };
}
