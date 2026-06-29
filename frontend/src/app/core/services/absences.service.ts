import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Absence, AbsenceReason } from '../models';

export interface AbsenceInput {
  doctorId: string;
  startDate: string;
  endDate: string;
  reason: AbsenceReason;
  note?: string;
}

@Injectable({ providedIn: 'root' })
export class AbsencesService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/absences`;

  list(doctorId?: string) {
    let params = new HttpParams();
    if (doctorId) {
      params = params.set('doctorId', doctorId);
    }
    return this.http.get<Absence[]>(this.url, { params });
  }
  create(input: AbsenceInput) {
    return this.http.post<Absence>(this.url, input);
  }
  remove(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
