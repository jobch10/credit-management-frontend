import { Component, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UserService } from '@/app/core/services/user.service';
import { User } from '@/app/shared/interfaces/config';
import { EnumAction } from '@/app/shared/enums';
import { PageHeaderComponent } from '@/app/shared/components/page-header/page-header.component';
import { TableCustomizableComponent } from '@/app/shared/components/table-customizable/table-customizable.component';
import { CrudPageBase } from '@/app/shared/class/CrudPageBase';
import { UserFormModalComponent } from './user-form-modal/user-form-modal.component';
import { USUARIOS_CONFIG } from './users.config';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    imports: [PageHeaderComponent, TableCustomizableComponent, UserFormModalComponent]
})
export class UsersComponent extends CrudPageBase<User> {
    private readonly _userService = inject(UserService);
    private readonly _messageService = inject(MessageService);

    dataKey = USUARIOS_CONFIG.dataKey;
    globalFilterFields = USUARIOS_CONFIG.globalFilterFields;
    columns = USUARIOS_CONFIG.columns;
    subtitle = 'Listado';

    formVisible = signal(false);
    editingId = signal<number | null>(null);

    constructor() {
        super();
        this.initCrud();
    }

    protected loadFn() {
        return this._userService.findAll();
    }

    protected override deleteFn(id: number) {
        return this._userService.delete(id);
    }

    protected override getDeleteMessage(row: User): string {
        return `¿Está seguro de que desea eliminar al usuario ${row.username}?`;
    }

    override onAdd(): void {
        this.editingId.set(null);
        this.formVisible.set(true);
    }

    protected mapRowActions(event: { action: string; row: User }): void {
        switch (event.action) {
            case EnumAction.EDITAR:
                this.editingId.set(event.row.id!);
                this.formVisible.set(true);
                break;

            case EnumAction.ELIMINAR:
                this.deleteRow(event.row);
                break;

            case 'assignRole':
                // pendiente
                break;

            case 'permissions':
                // pendiente
                break;
        }
    }

    onSaved(): void {
        this.formVisible.set(false);
        this.initCrud();
    }
}
