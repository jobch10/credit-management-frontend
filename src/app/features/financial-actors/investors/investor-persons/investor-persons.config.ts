import { EnumTagSeverity, TableColumn } from '@/app/shared/components/table-customizable/interfaces/table-customizable.interfaces';
import { FinancialSubject } from '@/app/shared/models';
import { EnumRiskTolerance } from '@/app/shared/enums';

export const INVESTOR_PERSONS_CONFIG = {
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
            field: 'investorProfile.investmentCapacity',
            header: 'Capacidad de inversión',
            type: 'text',
            body: (row: FinancialSubject) => {
                const v = row.investorProfile?.investmentCapacity;
                return v != null ? `S/ ${v.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` : '—';
            }
        },
        {
            field: 'investorProfile.riskTolerance',
            header: 'Tolerancia',
            type: 'tag',
            tagConfig: (row: FinancialSubject) => {
                const t = row.investorProfile?.riskTolerance;
                return {
                    value: t ?? '—',
                    severity: t === EnumRiskTolerance.AGRESIVO ? EnumTagSeverity.DANGER : t === EnumRiskTolerance.MODERADO ? EnumTagSeverity.WARN : EnumTagSeverity.SUCCESS
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

export const INVESTOR_PERSONS_FORM = {
    createDescription: 'Registrar inversionista',
    editDescription: 'Editar inversionista',
    createIconClass: 'pi pi-briefcase',
    editIconClass: 'pi pi-briefcase'
};
