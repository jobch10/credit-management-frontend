import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GenericService } from './generic.service';
import { ApiResponse } from '../models';
import { Loan } from '@/app/shared/models/Loan';

@Injectable({ providedIn: 'root' })
export class LoanService extends GenericService<Loan, number> {
    protected override endpoint = 'loans';

    /** Crea crédito y genera cronograma. */
    createLoan(dto: Loan): Observable<Loan> {
        return this.http.post<ApiResponse<Loan>>(`${this.url}/create`, dto).pipe(map((r) => r.data));
    }

    /** Obtiene crédito con cronograma completo. */
    getFullLoan(id: number): Observable<Loan> {
        return this.http.get<ApiResponse<Loan>>(`${this.url}/${id}/full`).pipe(map((r) => r.data));
    }

    /** Créditos por prestatario. */
    findByBorrower(subjectId: number): Observable<Loan[]> {
        return this.http.get<ApiResponse<Loan[]>>(`${this.url}/by-borrower/${subjectId}`).pipe(map((r) => r.data));
    }

    calculate(dto: Loan): Observable<Loan> {
        return this.http.post<ApiResponse<Loan>>(`${this.url}/calculate`, dto).pipe(map((r) => r.data));
    }
}
