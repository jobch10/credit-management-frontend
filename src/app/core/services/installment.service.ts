import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GenericService } from './generic.service';
import { ApiResponse } from '../models';
import { Installment } from '@/app/shared/models/Installment';

@Injectable({ providedIn: 'root' })
export class InstallmentService extends GenericService<Installment, number> {
    protected override endpoint = 'installments';

    /** Cronograma de un crédito. */
    findByLoan(loanId: number): Observable<Installment[]> {
        return this.http.get<ApiResponse<Installment[]>>(`${this.url}/by-loan/${loanId}`).pipe(map((r) => r.data));
    }

    /** Cuotas pendientes. */
    findPendingByLoan(loanId: number): Observable<Installment[]> {
        return this.http.get<ApiResponse<Installment[]>>(`${this.url}/pending/by-loan/${loanId}`).pipe(map((r) => r.data));
    }
}
