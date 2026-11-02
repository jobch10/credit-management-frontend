import { ActionService } from '@/app/core/services/action.service';
import { ModuleService } from '@/app/core/services/module.service';
import { CrudPageBase } from '@/app/shared/class/CrudPageBase';
import { PageHeaderComponent } from '@/app/shared/components/page-header/page-header.component';
import { TableCustomizableComponent } from '@/app/shared/components/table-customizable/table-customizable.component';
import { Module } from '@/app/shared/interfaces/config';
import { Component, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MODULOS_CONFIG } from './modules.config';
import { EnumAction } from '@/app/shared/enums';
import { ModuleFormModalComponent } from './module-form-modal/module-form-modal.component';
import { SelectionModalComponent } from '@/app/shared/components/selection-modal/selection-modal.component';
import { SelectOption } from '@/app/shared/interfaces/selects';
import { finalize, forkJoin } from 'rxjs';

@Component({
    selector: 'app-modules',
    templateUrl: './modules.component.html',
    imports: [PageHeaderComponent, TableCustomizableComponent, ModuleFormModalComponent, SelectionModalComponent]
})
export class ModulesComponent extends CrudPageBase<Module> {
    private readonly _moduleService = inject(ModuleService);
    private readonly _actionService = inject(ActionService);
    private readonly _messageService = inject(MessageService);

    dataKey = MODULOS_CONFIG.dataKey;
    globalFilterFields = MODULOS_CONFIG.globalFilterFields;
    columns = MODULOS_CONFIG.columns;
    subtitle = 'Listado';

    // Modal crear/editar
    formVisible = signal(false);
    editingId = signal<number | null>(null);

    //Asignar acciones
    assignActionsVisible = signal(false);
    assignActionsSaving = signal(false);
    assignActionsOptions = signal<SelectOption[]>([]);
    assignActionsSelected = signal<Array<string | number | null>>([]);
    assignActionsModuleId = signal<number | null>(null);

    constructor() {
        super();
        this.initCrud();
    }

    protected loadFn() {
        return this._moduleService.findAll();
    }

    protected override deleteFn(id: number) {
        return this._moduleService.delete(id);
    }

    protected override getDeleteMessage(row: Module): string {
        return `¿Está seguro de que desea eliminar el módulo ${row.name}?`;
    }

    override onAdd(): void {
        this.editingId.set(null);
        this.formVisible.set(true);
    }

    protected mapRowActions(event: { action: string; row: Module }): void {
        switch (event.action) {
            case EnumAction.EDITAR:
                this.editingId.set(event.row.id);
                this.formVisible.set(true);
                break;

            case EnumAction.ELIMINAR:
                this.deleteRow(event.row);
                break;

            case EnumAction.ASIGNAR_ACCIONES:
                this.openAssignActions(event.row);
                break;
        }
    }

    onSaved(): void {
        this.formVisible.set(false);
        this.initCrud();
    }

    //----------------Aignar acciones-----------------//
    private openAssignActions(row: Module): void {
        this.assignActionsModuleId.set(row.id);
        forkJoin({
            actions: this._actionService.findAll(),
            selectedIds: this._moduleService.getActionIdsByModule(row.id)
        }).subscribe(({ actions, selectedIds }) => {
            this.assignActionsOptions.set(actions.map((a) => ({ label: a.name ?? '', value: a.id })));
            this.assignActionsSelected.set(selectedIds);
            this.assignActionsVisible.set(true);
        });
    }

    onAssignActionsSave(values: Array<string | number | null>): void {
        const id = this.assignActionsModuleId();
        if (id == null) return;

        this.assignActionsSaving.set(true);
        this._moduleService
            .updateModuleActions(id, values as number[])
            .pipe(finalize(() => this.assignActionsSaving.set(false)))
            .subscribe({
                next: () => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Cambios guardados',
                        detail: 'Las acciones del módulo se actualizaron correctamente.',
                        life: 3000
                    });
                    this.assignActionsVisible.set(false);
                    this.initCrud();
                }
            });
    }
}
