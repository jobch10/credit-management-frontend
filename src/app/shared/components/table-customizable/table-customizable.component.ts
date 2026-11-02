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
import { EnumTagSeverity, TableColumn, TableHeaderButton, TableIconData, TableRowButton, TableTagData } from './interfaces/table-customizable.interfaces';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'ui-table-customizable',
    templateUrl: './table-customizable.component.html',
    styleUrls: ['./table-customizable.component.scss'],
    imports: [CommonModule, FormsModule, TableModule, ButtonComponent, TagModule, InputTextModule, IconFieldModule, InputIconModule, TooltipModule, ButtonModule]
})
export class TableCustomizableComponent<T = any> {
    // ============ INPUTS ============
    @Input() data: T[] = [];
    @Input() columns: TableColumn<T>[] = [];
    @Input() rowButtons: TableRowButton<T>[] = [];
    @Input() headerButtons: TableHeaderButton[] = [];
    @Input() headerExtraTemplate: TemplateRef<any> | null = null;

    @Input() loading = false;
    @Input() rows = 10;
    @Input() rowsPerPageOptions: number[] = [5, 10, 15, 20, 25];
    @Input() globalFilterFields: string[] = [];
    @Input() emptyMessage = 'No se encontraron registros.';
    @Input() dataKey = 'id';
    @Input() showAddButton = false;
    @Input() showActions = true;

    @Output() onAdd = new EventEmitter<void>();
    @Output() headerButtonClick = new EventEmitter<string>();
    @Output() rowAction = new EventEmitter<{ action: string; row: T }>();

    searchValue = '';

    private static readonly SEVERITY_COLOR: Record<EnumTagSeverity, string> = {
        [EnumTagSeverity.SUCCESS]: 'var(--p-green-500)',
        [EnumTagSeverity.DANGER]: 'var(--p-red-500)',
        [EnumTagSeverity.WARN]: 'var(--p-amber-500)',
        [EnumTagSeverity.INFO]: 'var(--p-sky-500)',
        [EnumTagSeverity.SECONDARY]: 'var(--p-surface-500)',
        [EnumTagSeverity.CONTRAST]: 'var(--p-surface-900)'
    };

    get computedTableMinWidth(): string {
        const cols = this.columns.reduce((sum, col) => {
            const w = col.minWidth || col.width || '10rem';
            return sum + this.remToNumber(w);
        }, 0);
        const actions = this.showActions ? this.remToNumber(this.computedActionsWidth) : 0;
        return `${cols + actions}rem`;
    }

    private remToNumber(value: string): number {
        const n = parseFloat(value.match(/[\d.]+/)?.[0] ?? '10');
        return value.includes('px') ? n / 16 : n;
    }

    onAddClick() {
        this.onAdd.emit();
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

    get computedActionsWidth(): string {
        const visibleButtonsCount = this.rowButtons.filter((b) => b.visible !== false).length;
        return `${visibleButtonsCount * 2 + 1}rem`;
    }

    getIconData(column: TableColumn<T>, row: T): TableIconData {
        if (column.iconConfig) return column.iconConfig(row);
        return {
            icon: String(this.getNestedValue(row, String(column.field)) ?? ''),
            severity: EnumTagSeverity.SECONDARY
        };
    }

    getIconColor(severity: EnumTagSeverity): string {
        return TableCustomizableComponent.SEVERITY_COLOR[severity];
    }
}
