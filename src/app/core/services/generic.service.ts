import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models';

export abstract class GenericService<E, K> {
  protected readonly http = inject(HttpClient);
  protected readonly apiUrl = environment.apiUrl;

  protected abstract endpoint: string;

  protected get url(): string {
    return `${this.apiUrl}/${this.endpoint}`;
  }

  insert(payload: E): Observable<E> {
    return this.http
      .post<ApiResponse<E>>(this.url, payload)
      .pipe(map(res => res.data));
  }

  update(id: K, payload: E): Observable<E> {
    return this.http
      .put<ApiResponse<E>>(`${this.url}/${id}`, payload)
      .pipe(map(res => res.data));
  }

  findById(id: K): Observable<E> {
    return this.http
      .get<ApiResponse<E>>(`${this.url}/${id}`)
      .pipe(map(res => res.data));
  }

  findAll(): Observable<E[]> {
    return this.http
      .get<ApiResponse<E[]>>(`${this.url}/all`)
      .pipe(map(res => res.data));
  }

  delete(id: K): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.url}/${id}`)
      .pipe(map(() => void 0));
  }
}