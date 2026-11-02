import { FinancialSubject } from './FinancialSubject';
import { EnumRiskTolerance } from '../enums';

export interface InvestorProfile {
    id?: number | null;
    financialSubjectId?: number | null;
    financialSubject?: FinancialSubject | null;

    investmentCapacity: number;
    preferredRate?: number | null;
    preferredTermMonths?: number | null;
    riskTolerance?: EnumRiskTolerance | null;

    bankName?: string | null;
    bankAccount?: string | null;
    notes?: string | null;

    // Solo lectura (llenado por el sistema)
    totalInvested?: number | null;
    activeInvestments?: number | null;
}
