import { EnumHousingType, EnumRiskLevel, EnumEmploymentType, EnumInfocorpStatus } from '../enums';

export interface CreditProfile {
    id?: number | null;
    financialSubjectId?: number | null;
    dependentsCount: number;
    housingType: EnumHousingType;
    monthlyIncome: number;
    fixedExpenses: number;
    externalDebtPayments: number;

    // Situación laboral
    occupation?: string | null;
    employer?: string | null;
    workSeniorityMonths?: number | null;
    employmentType?: EnumEmploymentType | null;

    // Verificación externa
    infocorpStatus?: EnumInfocorpStatus | null;
    infocorpScore?: number | null;
    hasPoliceRecords?: boolean | null;
    hasJudicialRecords?: boolean | null;
    hasCriminalRecords?: boolean | null;

    // Control interno
    totalLoansApproved?: number | null;
    maxDaysInArrears?: number | null;
    timesRefinanced?: number | null;
    creditScore?: number | null;
    riskLevel?: EnumRiskLevel | null;
}
