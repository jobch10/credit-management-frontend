import { FinancialSubject } from './FinancialSubject';
import { EnumLoanStatus, EnumPaymentFrequency, EnumGuaranteeType } from '../enums';
import { Installment } from './Installment';
import { LoanFunding } from './LoanFunding';

export interface Loan {
    id?: number | null;

    borrowerSubjectId: number;
    borrowerSubject?: FinancialSubject | null;

    loanNumber: string;
    principalAmount: number;
    interestRate: number;
    termMonths: number;
    paymentFrequency: EnumPaymentFrequency;
    startDate: string;
    endDate?: string | null;
    totalInterest?: number | null;
    totalToPay?: number | null;
    status?: EnumLoanStatus | null;
    guaranteeType?: EnumGuaranteeType | null;
    guaranteeDescription?: string | null;
    notes?: string | null;

    monthlyPayment?: number | null;

    installments?: Installment[] | null;
    fundings?: LoanFunding[] | null;
}
