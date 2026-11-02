import { Module } from '@/app/shared/interfaces/config';
import { EnumModuleType } from '@/app/shared/enums';
import { EnumTagSeverity, TableColumn } from '@/app/shared/components/table-customizable/interfaces/table-customizable.interfaces';

export const MODULOS_CONFIG = {
    dataKey: 'id' as keyof Module,

    globalFilterFields: ['name', 'code', 'route', 'state'] as (keyof Module)[],

    columns: [
        { field: 'name', header: 'Nombre', sortable: true },
        { field: 'code', header: 'Código', sortable: true },
        {
            field: 'icon',
            header: 'Icono',
            type: 'icon',
        },
        { field: 'route', header: 'Ruta', sortable: true },
        {
            field: 'type',
            header: 'Tipo',
            type: 'tag',
            tagConfig: (row: Module) => ({
                value: row.type ?? '—',
                severity: row.type === EnumModuleType.GRUPO ? EnumTagSeverity.INFO : EnumTagSeverity.SECONDARY
            })
        },
        {
            field: 'state',
            header: 'Estado',
            type: 'tag',
            tagConfig: (row: Module) => ({
                value: row.state ? 'Activo' : 'Inactivo',
                severity: row.state ? EnumTagSeverity.SUCCESS : EnumTagSeverity.DANGER
            })
        }
    ] as TableColumn<Module>[]
};
