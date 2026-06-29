import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Availability, Doctor } from '../models';

export interface DoctorInput {
  firstName: string;
  lastName: string;
  specialtyId: string;
  centerId: string;
  availabilities?: Availability[];
}

@Injectable({ providedIn: 'root' })
export class DoctorsService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/doctors`;

  /** Liste les médecins, filtrables par spécialité et/ou centre. */
  list(filters?: { specialtyId?: string; centerId?: string }) {
    let params = new HttpParams();
    if (filters?.specialtyId) {
      params = params.set('specialtyId', filters.specialtyId);
    }
    if (filters?.centerId) {
      params = params.set('centerId', filters.centerId);
    }
    return this.http.get<Doctor[]>(this.url, { params });
  }
  get(id: string) {
    return this.http.get<Doctor>(`${this.url}/${id}`);
  }
  create(input: DoctorInput) {
    return this.http.post<Doctor>(this.url, input);
  }
  update(id: string, input: DoctorInput) {
    return this.http.put<Doctor>(`${this.url}/${id}`, input);
  }
  remove(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
