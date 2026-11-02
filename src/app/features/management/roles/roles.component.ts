import { RoleService } from '@/app/core/services/role.service';
import { CrudPageBase } from '@/app/shared/class/CrudPageBase';
import { PageHeaderComponent } from '@/app/shared/components/page-header/page-header.component';
import { TableCustomizableComponent } from '@/app/shared/components/table-customizable/table-customizable.component';
import { EnumAction } from '@/app/shared/enums';
import { Role } from '@/app/shared/interfaces/config';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleFormModalComponent } from './role-form-modal/role-form-modal.component';
import { ROLES_CONFIG } from './roles.config';

@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
    imports: [PageHeaderComponent, TableCustomizableComponent, RoleFormModalComponent]
})
export class RolesComponent extends CrudPageBase<Role> {
    private readonly _roleService = inject(RoleService);
    private readonly _router = inject(Router);
    private readonly _route = inject(ActivatedRoute);

    dataKey = ROLES_CONFIG.dataKey;
    globalFilterFields = ROLES_CONFIG.globalFilterFields;
    columns = ROLES_CONFIG.columns;
    subtitle = 'Listado';

    formVisible = signal(false);
    editingId = signal<number | null>(null);

    constructor() {
        super();
        this.initCrud();
    }

    protected loadFn() {
        return this._roleService.findAll();
    }

    protected override deleteFn(id: number) {
        return this._roleService.delete(id);
    }

    protected override getDeleteMessage(row: Role): string {
        return `¿Está seguro de que desea eliminar el rol ${row.name}?`;
    }

    override onAdd(): void {
        this.editingId.set(null);
        this.formVisible.set(true);
    }

    protected mapRowActions(event: { action: string; row: Role }): void {
        switch (event.action) {
            case EnumAction.EDITAR:
                this.editingId.set(event.row.id!);
                this.formVisible.set(true);
                break;

            case EnumAction.ELIMINAR:
                this.deleteRow(event.row);
                break;

            case EnumAction.ASIGNAR_PERMISOS:
                this._router.navigate(['role-permissions', event.row.id], { relativeTo: this._route });
                break;
        }
    }

    onSaved(): void {
        this.formVisible.set(false);
        this.initCrud();
    }
}
