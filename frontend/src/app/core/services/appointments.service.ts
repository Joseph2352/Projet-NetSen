import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Appointment, Slot } from '../models';

@Injectable({ providedIn: 'root' })
export class AppointmentsService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/appointments`;

  /** Créneaux disponibles d'un médecin pour une date (YYYY-MM-DD). */
  slots(doctorId: string, date: string) {
    const params = new HttpParams().set('doctorId', doctorId).set('date', date);
    return this.http.get<Slot[]>(`${this.url}/slots`, { params });
  }

  book(doctorId: string, startTime: string) {
    return this.http.post<Appointment>(this.url, { doctorId, startTime });
  }

  /** Rendez-vous du patient connecté. */
  mine() {
    return this.http.get<Appointment[]>(`${this.url}/me`);
  }

  /** Tous les rendez-vous (admin). */
  all() {
    return this.http.get<Appointment[]>(this.url);
  }

  cancel(id: string) {
    return this.http.patch<Appointment>(`${this.url}/${id}/cancel`, {});
  }
}
