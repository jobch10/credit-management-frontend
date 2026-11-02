import { AuthStore } from '@/app/core/store/auth.store';
import { computed, inject, signal } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { TableColumn, TableHeaderButton, TableRowButton } from '../components/table-customizable/interfaces/table-customizable.interfaces';
import { EnumAction } from '../enums';
import { Action } from '../interfaces/config';
import { MessageUtilService } from '../utils/message-util.service';

export abstract class CrudPageBase<T> {
    protected readonly _authStore = inject(AuthStore);
    protected readonly messageUtilService = inject(MessageUtilService);

    loading = signal(true);
    data = signal<T[]>([]);

    protected readonly module = computed(() => this._authStore.currentModule());
    actions = computed<Action[]>(() => this.module()?.actions ?? []);
    protected abstract loadFn(): Observable<T[]>;
    protected deleteFn?(id: number): Observable<void>;
    protected abstract getDeleteMessage(row: T): string;
    protected abstract mapRowActions(event: { action: string; row: T }): void;

    abstract columns: TableColumn<T>[];
    abstract globalFilterFields: string[];
    abstract dataKey: keyof T | string;

    protected initCrud(): void {
        this.loading.set(true);
        this.loadFn()
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe((res) => this.data.set(res));
    }

    rowButtons = computed<TableRowButton<T>[]>(() =>
        this.actions()
            .filter((a) => a.code !== EnumAction.AGREGAR)
            .map((a) => {
                const button: TableRowButton<T> = {
                    key: a.code ?? '',
                    icon: a.icon ?? 'pi pi-circle',
                    tooltip: a.name ?? '',
                    severity: a.color ?? undefined,
                    visible: a.state ?? false,
                    disabled: false
                };
                return this.customizeRowButton(button, a);
            })
    );

    addButton = computed<TableHeaderButton | null>(() => {
        const add = this.actions().find((a) => a.code === EnumAction.AGREGAR);
        if (!add) return null;

        return {
            key: add.code ?? 'add',
            label: add.name ?? 'Agregar',
            icon: add.icon ?? undefined,
            color: add.color ?? undefined,
            visible: true,
            disabled: false
        };
    });

    onAdd(): void {}

    onRowAction(event: { action: string; row: T }): void {
        this.mapRowActions(event);
    }

    protected deleteRow(row: T): void {
        const id = (row as any).id;
        if (!id) return;

        this.messageUtilService.confirm({
            message: this.getDeleteMessage(row),
            header: 'Confirmar Eliminación',
            accept: () => {
                if (!this.deleteFn) return;
                this.deleteFn(id).subscribe({
                    next: () => {
                        this.messageUtilService.getAlertSuccess('Registro eliminado correctamente');
                        const currentData = this.data();
                        this.data.set(currentData.filter((c) => (c as any).id !== id));
                    }
                });
            }
        });
    }

    protected customizeRowButton(button: TableRowButton<T>, action: Action): TableRowButton<T> {
        return button;
    }
}
