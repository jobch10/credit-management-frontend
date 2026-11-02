import { EnumTagSeverity, TableColumn } from '@/app/shared/components/table-customizable/interfaces/table-customizable.interfaces';
import { User } from '@/app/shared/interfaces/config';

export const USUARIOS_CONFIG = {
    dataKey: 'id' as keyof User,

    globalFilterFields: ['names', 'email', 'username', 'state'] as (keyof User)[],

    columns: [
        { field: 'names', header: 'Nombres', sortable: true },
        { field: 'email', header: 'Correo', sortable: true },
        { field: 'username', header: 'Usuario', sortable: true },
        { field: 'role.name', header: 'Rol', sortable: false },
        {
            field: 'state',
            header: 'Estado',
            type: 'tag',
            tagConfig: (row: User) => ({
                value: row.state ? 'Activo' : 'Inactivo',
                severity: row.state ? EnumTagSeverity.SUCCESS : EnumTagSeverity.DANGER
            })
        }
    ] as TableColumn<User>[]
};
