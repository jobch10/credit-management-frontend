import { AuthStore } from '@/app/core/store/auth.store';
import { PageHeaderComponent } from '@/app/shared/components/page-header/page-header.component';
import { EnumTagSeverity, TableColumn, TableHeaderButton, TableRowButton } from '@/app/shared/components/table-customizable/interfaces/table-customizable.interfaces';
import { TableCustomizableComponen } from '@/app/shared/components/table-customizable/table-customizable.component';
import { Component, computed, inject, signal } from '@angular/core';

interface DemoRow {
    id: number;
    code: string;
    name: string;
    state: boolean;
}

@Component({
    selector: 'app-actions',
    templateUrl: './actions.component.html',
    imports: [PageHeaderComponent, TableCustomizableComponen]
})
export class ActionsComponent {
    private readonly _authStore = inject(AuthStore);

    readonly module = computed(() => this._authStore.currentModule());
    subtitle = 'Listado';

    data = signal<DemoRow[]>([
        { id: 1, code: 'ACC-001', name: 'Crear usuario', state: true },
        { id: 2, code: 'ACC-002', name: 'Editar usuario', state: true },
        { id: 3, code: 'ACC-003', name: 'Eliminar usuario', state: false },
        { id: 4, code: 'ACC-004', name: 'Exportar reporte', state: true },
        { id: 5, code: 'ACC-005', name: 'Ver auditoría', state: false }
    ]);

    loading = signal(false);
    dataKey = 'id';
    globalFilterFields = ['code', 'name'];

    columns: TableColumn<DemoRow>[] = [
        { field: 'code', header: 'Código', sortable: true, frozen: true, width: '6rem' },
        { field: 'name', header: 'Nombre', sortable: true, frozen: false, width: '10rem' },
        {
            field: 'state',
            header: 'Estado',
            type: 'tag',
            width: '10rem',
            tagConfig: (row: DemoRow) => ({
                value: row.state ? 'Activo' : 'Inactivo',
                severity: row.state ? EnumTagSeverity.SUCCESS : EnumTagSeverity.DANGER
            })
        }
    ];

    headerButtons: TableHeaderButton[] = [{ key: 'add', label: 'Agregar', icon: 'pi pi-plus', severity: 'contrast' }];

    rowButtons: TableRowButton<DemoRow>[] = [
        { key: 'edit', icon: 'pi pi-pencil', tooltip: 'Editar', color: '#F59E0B' },
        { key: 'delete', icon: 'pi pi-trash', tooltip: 'Eliminar', color: '#EF4444' }
    ];

    onHeaderButtonClick(key: string): void {
        if (key === 'add') {
            console.log('Agregar nueva acción');
        }
    }

    onRowAction(event: { action: string; row: DemoRow }): void {
        console.log('row action', event);
    }
}
