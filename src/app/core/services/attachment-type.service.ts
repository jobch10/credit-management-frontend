import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models';
import { TypeDocument } from '../../shared/interfaces/actors';

@Injectable({
  providedIn: 'root'
})
export class AttachmentTypeService {

  private readonly _url = `${environment.apiUrl}/attachment-types`;

  private readonly _http = inject(HttpClient);

  findById(id: number): Observable<TypeDocument> {
    return this._http
      .get<ApiResponse<TypeDocument>>(`${this._url}/${id}`)
      .pipe(map(res => res.data));
  }

  findAll(): Observable<TypeDocument[]> {
    return this._http
      .get<ApiResponse<TypeDocument[]>>(`${this._url}/all`)
      .pipe(map(res => res.data));
  }

  create(type: Partial<TypeDocument>): Observable<TypeDocument> {
    return this._http
      .post<ApiResponse<TypeDocument>>(`${this._url}`, type)
      .pipe(map(res => res.data));
  }

  update(id: number, type: Partial<TypeDocument>): Observable<TypeDocument> {
    return this._http
      .put<ApiResponse<TypeDocument>>(`${this._url}/${id}`, type)
      .pipe(map(res => res.data));
  }

  delete(id: number): Observable<void> {
    return this._http
      .delete<ApiResponse<void>>(`${this._url}/${id}`)
      .pipe(map(() => {}));
  }
}