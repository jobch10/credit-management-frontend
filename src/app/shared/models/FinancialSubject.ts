import { Person } from './Person';
import { CreditProfile } from './CreditProfile';
import { EnumSubjectStatus, EnumSubjectType } from '../enums';
import { SubjectRole } from './SubjectRole';
import { InvestorProfile } from './InvestorProfile';

export interface FinancialSubject {
    id?: number | null;
    subjectType: EnumSubjectType;
    address: string;
    email?: string | null;
    phoneNumber?: string | null;
    status: EnumSubjectStatus;
    person?: Person | null;
    roles?: SubjectRole[] | null;
    creditProfile?: CreditProfile | null;
    investorProfile?: InvestorProfile | null;
}
