import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { finalize } from 'rxjs';

import { RoleService } from '@/app/core/services/role.service';
import { InputTextComponent } from '@/app/shared/components/input-text/input-text.component';
import { InputSelectComponent } from '@/app/shared/components/input-select/input-select.component';
import { Role } from '@/app/shared/interfaces/config';

@Component({
    selector: 'app-role-form-modal',
    templateUrl: './role-form-modal.component.html',
    imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextComponent, InputSelectComponent]
})
export class RoleFormModalComponent implements OnInit, OnChanges {
    private readonly _fb = inject(UntypedFormBuilder);
    private readonly _roleService = inject(RoleService);
    private readonly _msg = inject(MessageService);

    @Input() visible = false;
    @Input() id: number | null = null;

    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() saved = new EventEmitter<Role>();
    @Output() cancelled = new EventEmitter<void>();

    saving = signal(false);
    submitted = signal(false);

    readonly isEdit = computed(() => this.id != null);
    readonly title = computed(() => (this.isEdit() ? 'Editar rol' : 'Nuevo rol'));

    readonly stateOptions = [
        { label: 'Activo', value: true },
        { label: 'Inactivo', value: false }
    ];

    form = this._fb.group({
        id: [null as number | null],
        name: ['', [Validators.required, Validators.maxLength(100)]],
        code: ['', [Validators.required, Validators.maxLength(50)]],
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
        this.form.reset({
            id: null,
            name: '',
            code: '',
            state: true
        });

        if (this.id != null) {
            this._roleService.findById(this.id).subscribe((row) => {
                this.form.patchValue({
                    id: row.id ?? null,
                    name: row.name ?? '',
                    code: row.code ?? '',
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

        const payload = this.form.getRawValue() as Role;
        this.saving.set(true);

        const req$ = payload.id ? this._roleService.update(payload.id, payload) : this._roleService.insert(payload);

        req$.pipe(finalize(() => this.saving.set(false))).subscribe({
            next: (res) => {
                this._msg.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: payload.id ? 'Rol actualizado' : 'Rol creado',
                    life: 3000
                });
                this.saved.emit(res as Role);
                this.close();
            }
        });
    }
}
