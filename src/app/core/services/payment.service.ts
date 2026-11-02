import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GenericService } from './generic.service';
import { ApiResponse } from '../models';
import { Payment } from '@/app/shared/models/Payment';

@Injectable({ providedIn: 'root' })
export class PaymentService extends GenericService<Payment, number> {
    protected override endpoint = 'payments';

    /** Registra un pago. */
    register(dto: Payment): Observable<Payment> {
        return this.http.post<ApiResponse<Payment>>(`${this.url}/register`, dto).pipe(map((r) => r.data));
    }

    /** Pagos por crédito. */
    findByLoan(loanId: number): Observable<Payment[]> {
        return this.http.get<ApiResponse<Payment[]>>(`${this.url}/by-loan/${loanId}`).pipe(map((r) => r.data));
    }
}
