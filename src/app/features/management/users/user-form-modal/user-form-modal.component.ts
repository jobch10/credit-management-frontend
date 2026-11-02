import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { finalize } from 'rxjs';

import { RoleService } from '@/app/core/services/role.service';
import { UserService } from '@/app/core/services/user.service';
import { InputSelectComponent } from '@/app/shared/components/input-select/input-select.component';
import { InputTextComponent } from '@/app/shared/components/input-text/input-text.component';
import { Role, User } from '@/app/shared/interfaces/config';
import { SelectOption } from '@/app/shared/interfaces/selects';

@Component({
    selector: 'app-user-form-modal',
    templateUrl: './user-form-modal.component.html',
    imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextComponent, InputSelectComponent]
})
export class UserFormModalComponent implements OnInit, OnChanges {
    private readonly _fb = inject(UntypedFormBuilder);
    private readonly _userService = inject(UserService);
    private readonly _roleService = inject(RoleService);
    private readonly _msg = inject(MessageService);

    @Input() visible = false;
    @Input() id: number | null = null;

    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() saved = new EventEmitter<User>();
    @Output() cancelled = new EventEmitter<void>();

    saving = signal(false);
    submitted = signal(false);

    readonly isEdit = computed(() => this.id != null);
    readonly title = computed(() => (this.isEdit() ? 'Editar usuario' : 'Nuevo usuario'));

    readonly stateOptions = [
        { label: 'Activo', value: true },
        { label: 'Inactivo', value: false }
    ];

    roles: SelectOption<Role>[] = [];

    form = this._fb.group({
        id: [null as number | null],
        names: ['', [Validators.required, Validators.maxLength(150)]],
        email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
        username: ['', [Validators.required, Validators.maxLength(50)]],
        state: [true, [Validators.required]],
        roleId: [null as number | null, [Validators.required]]
    });

    ngOnInit(): void {
        this._roleService.findAllOptions().subscribe((opts) => (this.roles = opts));
        this.load();
    }

    ngOnChanges(): void {
        if (this.visible) this.load();
    }

    private load(): void {
        this.submitted.set(false);
        this.form.reset({
            id: null,
            names: '',
            email: '',
            username: '',
            state: true,
            roleId: null
        });

        if (this.id != null) {
            this._userService.findById(this.id).subscribe((row) => {
                this.form.patchValue({
                    id: row.id,
                    names: row.names ?? '',
                    email: row.email ?? '',
                    username: row.username ?? '',
                    state: row.state ?? true,
                    roleId: row.role?.id ?? row.roleId ?? null
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

        const payload = this.form.getRawValue() as User;
        this.saving.set(true);

        const req$ = payload.id ? this._userService.update(payload.id, payload) : this._userService.insert(payload);

        req$.pipe(finalize(() => this.saving.set(false))).subscribe({
            next: (res) => {
                this._msg.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: payload.id ? 'Usuario actualizado' : 'Usuario creado',
                    life: 3000
                });
                this.saved.emit(res as User);
                this.close();
            }
        });
    }
}
