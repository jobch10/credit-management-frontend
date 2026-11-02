import { EnumTagSeverity, TableColumn } from '@/app/shared/components/table-customizable/interfaces/table-customizable.interfaces';
import { Role } from '@/app/shared/interfaces/config';

export const ROLES_CONFIG = {
    dataKey: 'id' as keyof Role,

    globalFilterFields: ['name', 'code', 'state'] as (keyof Role)[],

    columns: [
        { field: 'name', header: 'Nombre', sortable: true },
        { field: 'code', header: 'Código', sortable: true },
        {
            field: 'state',
            header: 'Estado',
            type: 'tag',
            tagConfig: (row: Role) => ({
                value: row.state ? 'Activo' : 'Inactivo',
                severity: row.state ? EnumTagSeverity.SUCCESS : EnumTagSeverity.DANGER
            })
        }
    ] as TableColumn<Role>[]
};
