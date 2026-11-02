import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GenericService } from './generic.service';
import { ApiResponse } from '../models';
import { LoanFunding } from '@/app/shared/models/LoanFunding';

@Injectable({ providedIn: 'root' })
export class LoanFundingService extends GenericService<LoanFunding, number> {
    protected override endpoint = 'loan-fundings';

    /** Registra un fondeo para el crédito. */
    addFunding(loanId: number, dto: LoanFunding): Observable<LoanFunding> {
        return this.http.post<ApiResponse<LoanFunding>>(`${this.url}/loan/${loanId}`, dto).pipe(map((r) => r.data));
    }

    /** Fondeos por crédito. */
    findByLoan(loanId: number): Observable<LoanFunding[]> {
        return this.http.get<ApiResponse<LoanFunding[]>>(`${this.url}/by-loan/${loanId}`).pipe(map((r) => r.data));
    }
}
