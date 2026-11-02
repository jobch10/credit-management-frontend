import { EnumSubjectRole } from '../enums/subject-role.enum';

export interface SubjectRole {
    id?: number | null;
    financialSubjectId?: number | null;
    role?: EnumSubjectRole | null;
}
