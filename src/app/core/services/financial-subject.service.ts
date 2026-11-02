import { FinancialSubject } from '@/app/shared/models';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models';
import { GenericService } from './generic.service';

@Injectable({
    providedIn: 'root'
})
export class FinancialSubjectService extends GenericService<FinancialSubject, number> {
    protected override endpoint = 'subjects';

    findBorrowerPersons(): Observable<FinancialSubject[]> {
        return this.http.get<ApiResponse<FinancialSubject[]>>(`${this.url}/borrowers/persons`).pipe(map((res) => res.data));
    }

    findBorrowerCompanies(): Observable<FinancialSubject[]> {
        return this.http.get<ApiResponse<FinancialSubject[]>>(`${this.url}/borrowers/companies`).pipe(map((res) => res.data));
    }

    findInvestorPersons(): Observable<FinancialSubject[]> {
        return this.http.get<ApiResponse<FinancialSubject[]>>(`${this.url}/investors/persons`).pipe(map((res) => res.data));
    }

    findInvestorCompanies(): Observable<FinancialSubject[]> {
        return this.http.get<ApiResponse<FinancialSubject[]>>(`${this.url}/investors/companies`).pipe(map((res) => res.data));
    }

    /** Crea un sujeto tipo persona con su perfil de crédito y roles. */
    createPersonSubject(dto: FinancialSubject): Observable<FinancialSubject> {
        return this.http.post<ApiResponse<FinancialSubject>>(`${this.url}/person`, dto).pipe(map((res) => res.data));
    }

    /** Actualiza el sujeto, los datos de la persona y su perfil de crédito. */
    updatePersonSubject(id: number, dto: FinancialSubject): Observable<FinancialSubject> {
        return this.http.put<ApiResponse<FinancialSubject>>(`${this.url}/${id}/person`, dto).pipe(map((res) => res.data));
    }

    /** Devuelve la ficha completa del sujeto con persona, roles y perfil. */
    getFullSubject(id: number): Observable<FinancialSubject> {
        return this.http.get<ApiResponse<FinancialSubject>>(`${this.url}/${id}/full`).pipe(map((res) => res.data));
    }

    /** Evalúa el perfil y devuelve score + riesgo sin guardar. */
    evaluate(dto: FinancialSubject): Observable<FinancialSubject> {
        return this.http.post<ApiResponse<FinancialSubject>>(`${this.url}/evaluate`, dto).pipe(map((res) => res.data));
    }
}
