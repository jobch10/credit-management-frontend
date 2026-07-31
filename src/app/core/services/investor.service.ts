import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Investor } from '../../shared/interfaces/person';
import { ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class InvestorService {
  private readonly _url = `${environment.apiUrl}/investors`

  private readonly _http = inject(HttpClient);

  findById(id: number): Observable<Investor> {
    return this._http.get<ApiResponse<Investor>>(`${this._url}/${id}`).pipe(map(res => res.data));
  }

  findAll(): Observable<Investor[]> {
    return this._http.get<ApiResponse<Investor[]>>(`${this._url}/all`).pipe(map(res => res.data));
  }

  create(investor: Partial<Investor>): Observable<Investor> {
    return this._http.post<ApiResponse<Investor>>(`${this._url}`, investor).pipe(map(res => res.data));
  }

  update(id: number, investor: Partial<Investor>): Observable<Investor> {
    return this._http.put<ApiResponse<Investor>>(`${this._url}/${id}`, investor).pipe(map(res => res.data));
  }

  delete(id: number): Observable<void> {
    return this._http.delete<ApiResponse<void>>(`${this._url}/${id}`).pipe(map(() => {}));
  }
}
