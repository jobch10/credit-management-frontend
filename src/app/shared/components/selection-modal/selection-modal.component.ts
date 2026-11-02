import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, computed, input, output, signal, linkedSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectOption } from '../../interfaces/selects';

type InternalOption = SelectOption & { checked: boolean };

@Component({
    selector: 'ui-selection-modal',
    templateUrl: './selection-modal.component.html',
    imports: [CommonModule, FormsModule, DialogModule, CheckboxModule, InputTextModule, ButtonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectionModalComponent {
    // -------- Inputs como signals --------
    visible = input<boolean>(false);
    options = input<SelectOption[]>([]);
    selectedValues = input<Array<string | number | null>>([]);

    title = input<string>('Selección');
    searchPlaceholder = input<string>('Buscar...');
    itemLabel = input<string>('Ítem');
    saving = input<boolean>(false);
    emptyMessage = input<string>('No hay resultados');

    // -------- Outputs --------
    visibleChange = output<boolean>();
    save = output<Array<string | number | null>>();
    change = output<Array<string | number | null>>();
    cancel = output<void>();

    // -------- Estado local --------
    search = signal('');

    internalOptions = linkedSignal<{ options: SelectOption[]; selected: Array<string | number | null> }, InternalOption[]>({
        source: () => ({
            options: this.options(),
            selected: this.selectedValues()
        }),
        computation: (src) =>
            src.options.map((o) => ({
                ...o,
                checked: src.selected.some((v) => v === o.value)
            }))
    });

    filteredOptions = computed<InternalOption[]>(() => {
        const term = this.search().trim().toLowerCase();
        const items = this.internalOptions();
        if (!term) return items;
        return items.filter((o) => o.label?.toLowerCase().includes(term));
    });

    allFilteredChecked = computed(() => {
        const items = this.filteredOptions();
        return items.length > 0 && items.every((i) => i.checked);
    });

    someFilteredChecked = computed(() => {
        const items = this.filteredOptions();
        return items.some((i) => i.checked) && !this.allFilteredChecked();
    });

    // -------- Acciones --------
    toggleAllFiltered(checked: boolean): void {
        const current = this.internalOptions();
        const filteredSet = new Set(this.filteredOptions());
        this.internalOptions.set(current.map((o) => (filteredSet.has(o) ? { ...o, checked } : o)));
        this.emitChanges();
    }

    toggleOption(option: InternalOption, checked: boolean): void {
        const current = this.internalOptions();
        this.internalOptions.set(current.map((o) => (o === option ? { ...o, checked } : o)));
        this.emitChanges();
    }

    onSave(): void {
        if (this.saving()) return;
        this.save.emit(this.getSelectedValues());
    }

    onCancel(): void {
        if (this.saving()) return;
        this.cancel.emit();
        this.close();
    }

    close(): void {
        this.visibleChange.emit(false);
    }

    private emitChanges(): void {
        this.change.emit(this.getSelectedValues());
    }

    private getSelectedValues(): Array<string | number | null> {
        return this.internalOptions()
            .filter((i) => i.checked)
            .map((i) => i.value)
            .filter((value): value is string | number | null => value === null || typeof value === 'string' || typeof value === 'number');
    }

    trackByValue(index: number, item: InternalOption): string | number {
        return typeof item.value === 'string' || typeof item.value === 'number' ? item.value : index;
    }
}
