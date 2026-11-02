import { Loan } from './Loan';
import { EnumInstallmentStatus } from '../enums';

export interface Installment {
    id?: number | null;
    loanId: number;
    loan?: Loan | null;
    installmentNumber?: number | null;
    dueDate?: string | null;
    principalAmount?: number | null;
    interestAmount?: number | null;
    totalAmount?: number | null;
    paidAmount?: number | null;
    paidDate?: string | null;
    status?: EnumInstallmentStatus | null;
    daysLate?: number | null;
}
