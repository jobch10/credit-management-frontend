import { ActionService } from '@/app/core/services/action.service';
import { InputSelectComponent } from '@/app/shared/components/input-select/input-select.component';
import { InputTextComponent } from '@/app/shared/components/input-text/input-text.component';
import { EnumTagSeverity } from '@/app/shared/components/table-customizable/interfaces/table-customizable.interfaces';
import { Action } from '@/app/shared/interfaces/config';
import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-accion-form-modal',
    imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextComponent, InputSelectComponent],
    templateUrl: './accion-form-modal.component.html'
})
export class AccionFormModalComponent implements OnInit {
    private readonly _fb = inject(UntypedFormBuilder);
    private readonly _actionService = inject(ActionService);
    private readonly _msg = inject(MessageService);

    @Input() visible = false;
    @Input() id: number | null = null;

    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() saved = new EventEmitter<Action>();
    @Output() cancelled = new EventEmitter<void>();

    saving = signal(false);
    submitted = signal(false);

    readonly isEdit = computed(() => this.id != null);
    readonly title = computed(() => (this.isEdit() ? 'Editar acción' : 'Nueva acción'));

    readonly stateOptions = [
        { label: 'Activo', value: true },
        { label: 'Inactivo', value: false }
    ];

    readonly colorOptions = [
        { label: 'Success', value: EnumTagSeverity.SUCCESS },
        { label: 'Danger', value: EnumTagSeverity.DANGER },
        { label: 'Warn', value: EnumTagSeverity.WARN },
        { label: 'Info', value: EnumTagSeverity.INFO },
        { label: 'Secondary', value: EnumTagSeverity.SECONDARY },
        { label: 'Contrast', value: EnumTagSeverity.CONTRAST }
    ];

    form = this._fb.group({
        id: [null as number | null],
        code: ['', [Validators.required, Validators.maxLength(20)]],
        name: ['', [Validators.required, Validators.maxLength(30)]],
        icon: ['', [Validators.required, Validators.maxLength(30)]],
        color: [null as EnumTagSeverity | null, [Validators.required]],
        state: [true, [Validators.required]]
    });

    ngOnInit(): void {
        this.load();
    }

    ngOnChanges(): void {
        if (this.visible) this.load();
    }

    private load(): void {
        this.submitted.set(false);
        this.form.reset({ id: null, code: '', name: '', icon: '', color: null, state: true });

        if (this.id != null) {
            this._actionService.findById(this.id).subscribe((row) => {
                this.form.patchValue({
                    id: row.id,
                    code: row.code ?? '',
                    name: row.name ?? '',
                    icon: row.icon ?? '',
                    color: (row.color as EnumTagSeverity) ?? null,
                    state: row.state ?? true
                });
            });
        }
    }

    close(): void {
        this.visibleChange.emit(false);
    }

    onCancel(): void {
        this.cancelled.emit();
        this.close();
    }

    save(): void {
        this.submitted.set(true);

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const payload = this.form.getRawValue() as Action;
        this.saving.set(true);

        const req$ = payload.id ? this._actionService.update(payload.id, payload) : this._actionService.insert(payload);

        req$.pipe(finalize(() => this.saving.set(false))).subscribe({
            next: (res) => {
                this._msg.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: payload.id ? 'Acción actualizada' : 'Acción creada',
                    life: 3000
                });
                this.saved.emit(res as Action);
                this.close();
            }
        });
    }
}
