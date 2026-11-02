import { EnumTagSeverity, TableColumn } from '@/app/shared/components/table-customizable/interfaces/table-customizable.interfaces';
import { EnumLoanStatus } from '@/app/shared/enums';
import { Loan } from '@/app/shared/models/Loan';

const formatCurrency = (v?: number | null) => (v != null ? `S/ ${v.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` : '—');

export const LOAN_CONFIG = {
    dataKey: 'id' as keyof Loan,
    globalFilterFields: ['loanNumber'] as any,
    columns: [
        { field: 'loanNumber', header: 'N° Crédito', sortable: true },
        {
            field: 'borrowerSubject.person.dni',
            header: 'Prestatario',
            body: (row: Loan) => {
                const p = row.borrowerSubject?.person;
                return p ? `${p.firstName} ${p.lastName}` : '—';
            }
        },
        {
            field: 'borrowerSubject.person.dni',
            header: 'Documento',
            body: (row: Loan) => row.borrowerSubject?.person?.dni ?? '—'
        },
        {
            field: 'principalAmount',
            header: 'Monto',
            type: 'text',
            body: (row: Loan) => formatCurrency(row.principalAmount)
        },
        {
            field: 'interestRate',
            header: 'Tasa',
            body: (row: Loan) => (row.interestRate != null ? `${row.interestRate}%` : '—')
        },
        {
            field: 'termMonths',
            header: 'Plazo',
            body: (row: Loan) => (row.termMonths != null ? `${row.termMonths} meses` : '—')
        },
        {
            field: 'startDate',
            header: 'Inicio',
            sortable: true
        },
        {
            field: 'status',
            header: 'Estado',
            type: 'tag',
            tagConfig: (row: Loan) => ({
                value: row.status ?? '—',
                severity: row.status === EnumLoanStatus.PAGADO ? EnumTagSeverity.SUCCESS : row.status === EnumLoanStatus.VENCIDO ? EnumTagSeverity.DANGER : row.status === EnumLoanStatus.ACTIVO ? EnumTagSeverity.INFO : EnumTagSeverity.WARN
            })
        }
    ] as TableColumn<Loan>[]
};

export const LOAN_FORM = {
    createDescription: 'Registrar crédito',
    editDescription: 'Editar crédito',
    createIconClass: 'pi pi-wallet',
    editIconClass: 'pi pi-wallet'
};
