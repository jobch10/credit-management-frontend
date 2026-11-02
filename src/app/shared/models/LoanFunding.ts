import { Loan } from './Loan';
import { FinancialSubject } from './FinancialSubject';
import { EnumLoanFundingStatus } from '../enums';

export interface LoanFunding {
    id?: number | null;
    loanId: number;
    loan?: Loan | null;
    investorSubjectId: number;
    investorSubject?: FinancialSubject | null;
    fundedAmount: number;
    fundedPercentage: number;
    expectedRate?: number | null;
    status?: EnumLoanFundingStatus | null;
}
