import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Specialty } from '../models';

@Injectable({ providedIn: 'root' })
export class SpecialtiesService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/specialties`;

  /** Liste les spécialités, filtrables par centre (parcours de réservation). */
  list(centerId?: string) {
    let params = new HttpParams();
    if (centerId) {
      params = params.set('centerId', centerId);
    }
    return this.http.get<Specialty[]>(this.url, { params });
  }
  create(name: string) {
    return this.http.post<Specialty>(this.url, { name });
  }
  update(id: string, name: string) {
    return this.http.put<Specialty>(`${this.url}/${id}`, { name });
  }
  remove(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
