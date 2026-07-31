import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Client } from '../../shared/interfaces/person';
import { ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly _url = `${environment.apiUrl}/clients`

  private readonly _http = inject(HttpClient);

  findById(id: number): Observable<Client> {
    return this._http.get<ApiResponse<Client>>(`${this._url}/${id}`).pipe(map(res => res.data));
  }

  findAll(): Observable<Client[]> {
    return this._http.get<ApiResponse<Client[]>>(`${this._url}/all`).pipe(map(res => res.data));
  }

  create(client: Partial<Client>): Observable<Client> {
    return this._http.post<ApiResponse<Client>>(`${this._url}`, client).pipe(map(res => res.data));
  }

  update(id: number, client: Partial<Client>): Observable<Client> {
    return this._http.put<ApiResponse<Client>>(`${this._url}/${id}`, client).pipe(map(res => res.data));
  }

  delete(id: number): Observable<void> {
    return this._http.delete<ApiResponse<void>>(`${this._url}/${id}`).pipe(map(() => {}));
  }
}
