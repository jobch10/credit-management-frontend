import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { TypeDocument } from '../../shared/interfaces/person';
import { ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TypeDocumentService {
    private readonly _url = `${environment.apiUrl}/type-documents`
    
    private readonly _http = inject(HttpClient);

    findAll(): Observable<TypeDocument[]> {
      return this._http.get<ApiResponse<TypeDocument[]>>(`${this._url}/all`).pipe(map(res => res.data));
    }
}
