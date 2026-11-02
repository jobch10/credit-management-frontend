import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models';
import { DocumentFile, TypeDocument } from '../../shared/interfaces/actors';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private readonly _url = `${environment.apiUrl}/documents`;

  private readonly _http = inject(HttpClient);

  uploadFiles(
    files: File[],
    entity: string,
    entityId: number,
    documentType?: TypeDocument,
  ): Observable<DocumentFile[]> {
    const formData = new FormData();

    files.forEach((file) => formData.append('files', file));
    formData.append('entity', entity);
    formData.append('entityId', entityId.toString());

    if (documentType) {
      const documentTypeValue = (
        documentType.code?.trim() ||
        documentType.name?.trim() ||
        ''
      ).toUpperCase();
      if (documentTypeValue) {
        formData.append('documentType', documentTypeValue);
      }
    }

    return this._http
      .post<ApiResponse<DocumentFile[]>>(`${this._url}/upload`, formData)
      .pipe(map((res) => res.data));
  }

  getByEntity(entity: string, entityId: number): Observable<DocumentFile[]> {
    return this._http
      .get<ApiResponse<DocumentFile[]>>(`${this._url}/entity/${entity}/${entityId}`)
      .pipe(map((res) => res.data));
  }

  downloadFile(filePath: string): Observable<Blob> {
    return this._http.get(`${this._url}/download`, {
      params: { filePath: filePath },
      responseType: 'blob',
    });
  }

  getFileDownloadUrl(filePath: string): string {
    return `${this._url}/download?filePath=${encodeURIComponent(filePath)}`;
  }

  update(id: number, document: Partial<DocumentFile>): Observable<DocumentFile> {
    return this._http
      .put<ApiResponse<DocumentFile>>(`${this._url}/${id}`, document)
      .pipe(map((res) => res.data));
  }

  delete(id: number): Observable<void> {
    return this._http.delete<ApiResponse<void>>(`${this._url}/${id}`).pipe(map(() => {}));
  }
}
