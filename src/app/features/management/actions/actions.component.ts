import { ActionService } from '@/app/core/services/action.service';
import { CrudPageBase } from '@/app/shared/class/CrudPageBase';
import { PageHeaderComponent } from '@/app/shared/components/page-header/page-header.component';
import { TableCustomizableComponent } from '@/app/shared/components/table-customizable/table-customizable.component';
import { EnumAction } from '@/app/shared/enums';
import { Action } from '@/app/shared/interfaces/config';
import { Component, inject, signal } from '@angular/core';
import { ACCIONES_CONFIG } from './actions.config';
import { AccionFormModalComponent } from './accion-form-modal/accion-form-modal.component';

interface DemoRow {
    id: number;
    code: string;
    name: string;
    state: boolean;
}

@Component({
    selector: 'app-actions',
    templateUrl: './actions.component.html',
    imports: [PageHeaderComponent, TableCustomizableComponent, AccionFormModalComponent]
})
export class ActionsComponent extends CrudPageBase<Action> {
    private readonly _actionService = inject(ActionService);

    dataKey = ACCIONES_CONFIG.dataKey;
    globalFilterFields = ACCIONES_CONFIG.globalFilterFields;
    columns = ACCIONES_CONFIG.columns;
    subtitle = 'Listado';

    //Modal
    modalVisible = signal(false);
    editingId = signal<number | null>(null);

    constructor() {
        super();
        this.initCrud();
    }

    protected loadFn() {
        return this._actionService.findAll();
    }

    protected override deleteFn(id: number) {
        return this._actionService.delete(id);
    }

    protected override getDeleteMessage(row: Action): string {
        return `¿Está seguro de que desea eliminar la acción ${row.name}?`;
    }

    override onAdd(): void {
        this.editingId.set(null);
        this.modalVisible.set(true);
    }

    protected mapRowActions(event: { action: string; row: Action }): void {
        switch (event.action) {
            case EnumAction.EDITAR:
                this.editingId.set(event.row.id ?? null);
                this.modalVisible.set(true);
                break;
            case EnumAction.ELIMINAR:
                this.deleteRow(event.row);
                break;
        }
    }

    onModalSaved(): void {
        this.modalVisible.set(false);
        this.initCrud();
    }
}
