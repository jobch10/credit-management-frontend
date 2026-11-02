import { EnumMaritalStatus } from '../enums';

export interface Person {
    id?: number | null;
    financialSubjectId?: number | null;
    dni?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    birthDate?: string | null;
    maritalStatus?: EnumMaritalStatus | null;
}
