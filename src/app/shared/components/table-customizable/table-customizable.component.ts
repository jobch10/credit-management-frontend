import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

import { ButtonComponent } from '../button/button.component';
import { EnumTagSeverity, TableColumn, TableHeaderButton, TableRowButton, TableTagData } from './interfaces/table-customizable.interfaces';

@Component({
    selector: 'ui-table-customizable',
    templateUrl: './table-customizable.component.html',
    styleUrls: ['./table-customizable.component.scss'],
    imports: [CommonModule, FormsModule, TableModule, ButtonComponent, TagModule, InputTextModule, IconFieldModule, InputIconModule, TooltipModule]
})
export class TableCustomizableComponen<T = any> {
    @Input() data: T[] = [];
    @Input() columns: TableColumn<T>[] = [];
    @Input() rowButtons: TableRowButton<T>[] = [];

    // Ahora soporta múltiples botones en el header (Agregar, Eliminar, Exportar, etc.)
    @Input() headerButtons: TableHeaderButton[] = [];
    // Slot libre para lo que no encaje en headerButtons (dropdowns, date pickers, etc.)
    @Input() headerExtraTemplate: TemplateRef<any> | null = null;

    @Input() loading = false;
    @Input() rows = 10;
    @Input() rowsPerPageOptions: number[] = [5, 10, 15, 20, 25];
    @Input() globalFilterFields: string[] = [];
    @Input() emptyMessage = 'No se encontraron registros.';
    @Input() dataKey = 'id';
    @Input() showAddButton = false;
    @Input() showActions = true;

    // Ancho fijo de la columna de acciones (para calcular el "right" de sticky)
    @Input() actionsWidth = '4rem';
    // Ancho mínimo total de la tabla, fuerza el scroll horizontal en las columnas no-frozen
    @Input() minWidth = '75rem';

    @Output() addClick = new EventEmitter<void>();
    @Output() headerButtonClick = new EventEmitter<string>();
    @Output() rowAction = new EventEmitter<{ action: string; row: T }>();

    searchValue = '';

    onAddClick() {
        this.addClick.emit();
    }

    onHeaderButtonClick(btn: TableHeaderButton): void {
        this.headerButtonClick.emit(btn.key ?? btn.label ?? '');
    }

    onRowAction(action: string, row: T): void {
        this.rowAction.emit({ action, row });
    }

    isVisible<TItem>(value: boolean | ((row: TItem) => boolean) | undefined, row: TItem): boolean {
        if (typeof value === 'function') return value(row);
        return value ?? true;
    }

    isDisabled<TItem>(value: boolean | ((row: TItem) => boolean) | undefined, row: TItem): boolean {
        if (typeof value === 'function') return value(row);
        return value ?? false;
    }

    getNestedValue(row: any, field: string): any {
        return field.split('.').reduce((acc, key) => acc?.[key], row);
    }

    toField(value: keyof T | string): string {
        return String(value);
    }

    getTagData(column: TableColumn<T>, row: T): TableTagData {
        if (column.tagConfig) {
            return column.tagConfig(row);
        }
        const value = this.getNestedValue(row, String(column.field));
        const normalizedValue = String(value ?? '');
        return {
            value: normalizedValue,
            severity: column.severityMap?.[normalizedValue] ?? EnumTagSeverity.SECONDARY
        };
    }

    getFrozenLeftOffset(index: number): string {
        let offset = 0;
        for (let i = 0; i < index; i++) {
            if (this.columns[i].frozen) {
                offset += this.parseWidth(this.columns[i].width);
            }
        }
        return `${offset}px`;
    }

    private parseWidth(width?: string): number {
        if (!width) return 160; // fallback ~10rem en px
        const match = width.match(/(\d+(\.\d+)?)/);
        if (!match) return 160;
        const value = parseFloat(match[0]);
        return width.includes('rem') ? value * 16 : value;
    }
}
