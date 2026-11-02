import { ModuleService } from '@/app/core/services/module.service';
import { AuthStore } from '@/app/core/store/auth.store';
import { InputSelectComponent } from '@/app/shared/components/input-select/input-select.component';
import { InputTextComponent } from '@/app/shared/components/input-text/input-text.component';
import { EnumModuleType } from '@/app/shared/enums';
import { Module } from '@/app/shared/interfaces/config';
import { SelectOption } from '@/app/shared/interfaces/selects';
import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { finalize, Observable, of } from 'rxjs';

@Component({
    selector: 'app-module-form-modal',
    templateUrl: './module-form-modal.component.html',
    imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextComponent, InputSelectComponent]
})
export class ModuleFormModalComponent implements OnInit, OnChanges {
    @ViewChild('parentId') parentIdRef?: InputSelectComponent;
    @ViewChild('type') typeRef?: InputSelectComponent;
    @ViewChild('icon') iconRef?: InputTextComponent;

    private readonly _fb = inject(UntypedFormBuilder);
    private readonly _moduleService = inject(ModuleService);
    private readonly _authStore = inject(AuthStore);
    private readonly _msg = inject(MessageService);

    @Input() visible = false;
    @Input() id: number | null = null;

    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() saved = new EventEmitter<Module>();
    @Output() cancelled = new EventEmitter<void>();

    saving = signal(false);
    submitted = signal(false);

    readonly isEdit = computed(() => this.id != null);
    readonly title = computed(() => (this.isEdit() ? 'Editar módulo' : 'Nuevo módulo'));

    readonly stateOptions = [
        { label: 'Activo', value: true },
        { label: 'Inactivo', value: false }
    ];

    readonly typeOptions = [
        { label: EnumModuleType.GRUPO, value: EnumModuleType.GRUPO },
        { label: EnumModuleType.MODULO, value: EnumModuleType.MODULO }
    ];

    modulesTypeGrupo = toSignal(this._moduleService.getModulesSelectOptionsByType(EnumModuleType.GRUPO), { initialValue: [] as SelectOption<Module>[] });

    // Guarda si el módulo tiene hijos (para bloquear el tipo en edición)
    private readonly _hasChildren = signal(false);

    form = this._fb.group({
        id: [null as number | null],
        name: ['', [Validators.required, Validators.maxLength(150)]],
        description: [null as string | null],
        code: ['', [Validators.required, Validators.maxLength(50)]],
        type: [null as EnumModuleType | null, [Validators.required]],
        icon: ['', [Validators.required]],
        route: [''],
        state: [true, [Validators.required]],
        parentId: [null as number | null]
    });

    ngOnInit(): void {
        this.load();
    }

    ngOnChanges(): void {
        if (this.visible) this.load();
    }

    private load(): void {
        this.submitted.set(false);
        this._hasChildren.set(false);
        this.form.reset({
            id: null,
            name: '',
            description: null,
            code: '',
            type: null,
            icon: '',
            route: '',
            state: true,
            parentId: null
        });
        this.applyTypeValidators();

        if (this.id != null) {
            this._moduleService.findById(this.id).subscribe((row) => {
                this._hasChildren.set((row.children?.length ?? 0) > 0);
                this.form.patchValue({
                    id: row.id,
                    name: row.name ?? '',
                    description: row.description ?? null,
                    code: row.code ?? '',
                    type: row.type ?? null,
                    icon: row.icon ?? '',
                    route: row.route ?? '',
                    state: row.state ?? true,
                    parentId: row.parentId ?? null
                });
                this.applyTypeValidators();
            });
        }
    }

    // ---------- Lógica de negocio ---------- //
    get showParentSelect(): boolean {
        return this.form.get('type')?.value !== EnumModuleType.GRUPO;
    }

    get isTypeDisabled(): boolean {
        return this._hasChildren();
    }

    private applyTypeValidators(): void {
        const type = this.form.get('type');
        const route = this.form.get('route');

        if (type?.value === EnumModuleType.MODULO) {
            route?.setValidators([Validators.required]);
        } else {
            route?.clearValidators();
        }
        route?.updateValueAndValidity({ emitEvent: false });

        // Si es grupo, limpiamos parentId
        if (type?.value === EnumModuleType.GRUPO) {
            this.form.get('parentId')?.setValue(null, { emitEvent: false });
        }
    }

    onTypeChange(): void {
        this.applyTypeValidators();
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

        const payload = this.form.getRawValue() as Module;
        this.saving.set(true);

        const req$ = payload.id ? this._moduleService.update(payload.id, payload) : this._moduleService.insert(payload);

        req$.pipe(finalize(() => this.saving.set(false))).subscribe({
            next: (res) => {
                this._msg.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: payload.id ? 'Módulo actualizado' : 'Módulo creado',
                    life: 3000
                });

                // Refrescar permisos en el store
                this._authStore.refreshProfile().subscribe({
                    next: () => {
                        this.saved.emit(res as Module);
                        this.close();
                    },
                    error: () => {
                        this.saved.emit(res as Module);
                        this.close();
                    }
                });
            }
        });
    }
}
