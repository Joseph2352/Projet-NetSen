import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Center } from '../models';

export type CenterInput = Omit<Center, 'id'>;

@Injectable({ providedIn: 'root' })
export class CentersService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/centers`;

  list() {
    return this.http.get<Center[]>(this.url);
  }
  create(input: CenterInput) {
    return this.http.post<Center>(this.url, input);
  }
  update(id: string, input: CenterInput) {
    return this.http.put<Center>(`${this.url}/${id}`, input);
  }
  remove(id: string) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
