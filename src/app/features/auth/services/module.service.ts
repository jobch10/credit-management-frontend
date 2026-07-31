import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Module } from '../../shared/interfaces/config';
import { ApiResponse } from '../../core/models';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class ModuloService {

  private readonly _baseUrl = `${environment.apiUrl}`;
  private readonly url = `${this._baseUrl}/modulos/all`;

  private readonly _http = inject(HttpClient);
  private readonly _auth = inject(AuthService);

  getAll(): Observable<Module[]> {
    const token = this._auth.getToken();
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });

    return this._http.get<ApiResponse<Module[]>>(this.url, { headers })
      .pipe(
        map(resp => resp.data.filter(m => m.state))
      );
  }
}