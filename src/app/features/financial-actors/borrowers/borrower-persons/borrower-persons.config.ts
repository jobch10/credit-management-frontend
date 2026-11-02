import { EnumTagSeverity, TableColumn } from '@/app/shared/components/table-customizable/interfaces/table-customizable.interfaces';
import { EnumRiskLevel } from '@/app/shared/enums';
import { FinancialSubject } from '@/app/shared/models';

export const BORROWER_PERSONS_CONFIG = {
    dataKey: 'id' as keyof FinancialSubject,
    globalFilterFields: ['person.dni', 'person.firstName', 'person.lastName', 'email'] as any,
    columns: [
        { field: 'person.dni', header: 'DNI', sortable: true },
        {
            field: 'person.firstName',
            header: 'Nombres',
            sortable: true,
            body: (row: FinancialSubject) => row.person?.firstName ?? '—'
        },
        {
            field: 'person.lastName',
            header: 'Apellidos',
            sortable: true,
            body: (row: FinancialSubject) => row.person?.lastName ?? '—'
        },
        {
            field: 'email',
            header: 'Email',
            body: (row: FinancialSubject) => row.email ?? '—'
        },
        {
            field: 'phoneNumber',
            header: 'Teléfono',
            body: (row: FinancialSubject) => row.phoneNumber ?? '—'
        },
        {
            field: 'creditProfile.creditScore',
            header: 'Score',
            type: 'tag',
            tagConfig: (row: FinancialSubject) => {
                const score = row.creditProfile?.creditScore ?? 0;
                return {
                    value: String(score),
                    severity: score >= 70 ? EnumTagSeverity.SUCCESS : score >= 40 ? EnumTagSeverity.WARN : EnumTagSeverity.DANGER
                };
            }
        },
        {
            field: 'creditProfile.riskLevel',
            header: 'Nivel de riesgo',
            type: 'tag',
            tagConfig: (row: FinancialSubject) => {
                const level = row.creditProfile?.riskLevel;
                return {
                    value: level ?? '—',
                    severity: level === EnumRiskLevel.ALTO ? EnumTagSeverity.DANGER : level === EnumRiskLevel.MEDIO ? EnumTagSeverity.WARN : EnumTagSeverity.SUCCESS
                };
            }
        },
        {
            field: 'status',
            header: 'Estado',
            type: 'tag',
            tagConfig: (row: FinancialSubject) => ({
                value: row.status === 'ACTIVO' ? 'Activo' : row.status === 'BLOQUEADO' ? 'Bloqueado' : 'Inactivo',
                severity: row.status === 'ACTIVO' ? EnumTagSeverity.SUCCESS : row.status === 'BLOQUEADO' ? EnumTagSeverity.DANGER : EnumTagSeverity.WARN
            })
        }
    ] as TableColumn<FinancialSubject>[]
};

export const BORROWER_PERSONS_FORM = {
    createDescription: 'Registrar prestatario',
    editDescription: 'Editar prestatario',
    createIconClass: 'pi pi-user-plus',
    editIconClass: 'pi pi-user-edit'
};
