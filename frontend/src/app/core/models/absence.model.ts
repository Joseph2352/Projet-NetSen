export type AbsenceReason = 'SICKNESS' | 'VACATION' | 'OTHER';

export interface Absence {
  id: string;
  doctorId: string;
  startDate: string;
  endDate: string;
  reason: AbsenceReason;
  note?: string;
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}
