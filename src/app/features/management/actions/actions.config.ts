import { Action } from '../../../shared/interfaces/config';

export const ACCIONES_CONFIG = {
    title: 'Acciones',
    description: 'Gestiona las acciones de los formularios del sistema.',
    iconClass: 'pi pi-fw pi-bolt',

    dataKey: 'id' as keyof Action,

    globalFilterFields: ['code', 'name', 'state'],

    // columns: [
    //     { field: 'code', header: 'Código', sortable: true },
    //     { field: 'name', header: 'Nombre', sortable: true },
    //     {
    //         field: 'state',
    //         header: 'Estado',
    //         type: 'tag',
    //         tagConfig: (row: Action) => ({
    //             value: row.state ? 'Activo' : 'Inactivo',
    //             severity: row.state ? EnumTagSeverity.SUCCESS : EnumTagSeverity.DANGER
    //         })
    //     }
    // ] as TableColumn<Action>[]
};

export const ACCIONES_FORM = {
    createTitle: 'Agregar acción',
    editTitle: 'Editar acción',
    createIconClass: 'fa-solid fa-user-plus',
    editIconClass: 'fa-solid fa-user-pen'
};
