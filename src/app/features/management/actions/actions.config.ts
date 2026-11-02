import { EnumTagSeverity, TableColumn } from '@/app/shared/components/table-customizable/interfaces/table-customizable.interfaces';
import { Action } from '../../../shared/interfaces/config';

export const ACCIONES_CONFIG = {
    title: 'Acciones',
    description: 'Gestiona las acciones de los formularios del sistema.',
    iconClass: 'pi pi-fw pi-bolt',

    dataKey: 'id' as keyof Action,

    globalFilterFields: ['code', 'name', 'state'],

    columns: [
        { field: 'code', header: 'Código', sortable: true },
        { field: 'name', header: 'Nombre', sortable: true },
        {
            field: 'icon',
            header: 'Icono',
            type: 'icon',
            frozen: false,
            iconConfig: (row: Action) => ({
                icon: row.icon ?? 'pi pi-question-circle',
                severity: row.color
            })
        },
        {
            field: 'state',
            header: 'Estado',
            type: 'tag',
            tagConfig: (row: Action) => ({
                value: row.state ? 'Activo' : 'Inactivo',
                severity: row.state ? EnumTagSeverity.SUCCESS : EnumTagSeverity.DANGER
            })
        }
    ] as TableColumn<Action>[]
};