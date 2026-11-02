import { EnumPaymentMethod } from '../enums';
import { Loan } from './Loan';

export interface Payment {
    id?: number | null;
    loanId: number;
    loan?: Loan | null;
    installmentId?: number | null;
    paymentDate: string;
    amount: number;
    paymentMethod: EnumPaymentMethod;
    reference?: string | null;
    notes?: string | null;
}
