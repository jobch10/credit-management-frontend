import { GenericService } from '@/app/core/services/generic.service';
import { computed, Directive, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

@Directive()
export abstract class CrudFormBase<T extends { id?: number | null }> implements OnInit {
    protected readonly route = inject(ActivatedRoute);
    protected readonly router = inject(Router);

    readonly pageLoading = signal(false);
    readonly saving = signal(false);
    readonly mode = signal<'create' | 'edit'>('create');
    readonly entityId = signal<number | null>(null);
    readonly entity = signal<T | null>(null);

    protected abstract service: GenericService<T, number>;

    protected createTitle = '';
    protected editTitle = '';
    protected createDescription = 'Registrar';
    protected editDescription = 'Editar';
    protected abstract createIconClass: string;
    protected abstract editIconClass: string;

    readonly title = computed(() => (this.mode() === 'edit' ? this.editTitle : this.createTitle));

    readonly description = computed(() => (this.mode() === 'edit' ? this.editDescription : this.createDescription));

    readonly iconClass = computed(() => (this.mode() === 'edit' ? this.editIconClass : this.createIconClass));

    ngOnInit(): void {
        this.onInitForm();

        const idParam = this.route.snapshot.paramMap.get('id');
        if (!idParam) {
            this.mode.set('create');
            this.entityId.set(null);
            return;
        }

        const id = Number(idParam);
        this.mode.set('edit');
        this.entityId.set(id);
        this.loadEntity(id);
    }

    protected onInitForm(): void {}

    protected loadEntity(id: number): void {
        this.pageLoading.set(true);

        this.service
            .findById(id)
            .pipe(finalize(() => this.pageLoading.set(false)))
            .subscribe({
                next: (entity) => {
                    this.entity.set(entity);
                    this.patchForm(entity);
                },
                error: (error) => this.onLoadError(error)
            });
    }

    save(): void {
        if (this.isInvalidForm()) {
            this.markFormTouched();
            return;
        }

        const payload = this.getPayload();
        this.saving.set(true);

        if (this.mode() === 'edit') {
            this.service
                .update(payload.id!, payload)
                .pipe(finalize(() => this.saving.set(false)))
                .subscribe({
                    next: () => this.goBack(),
                    error: (error) => this.onSaveError(error)
                });
            return;
        }

        this.service
            .insert(payload)
            .pipe(finalize(() => this.saving.set(false)))
            .subscribe({
                next: () => this.goBack(),
                error: (error) => this.onSaveError(error)
            });
    }

    onCancel(): void {
        this.goBack();
    }

    protected afterSaveSuccess(): void {
        this.goBack();
    }

    protected goBack(): void {
        this.router.navigate(['./'], { relativeTo: this.route.parent });
    }

    protected onLoadError(error: unknown): void {
        console.error('Error al cargar registro', error);
    }

    protected onSaveError(error: unknown): void {
        console.error('Error al guardar registro', error);
    }

    protected abstract patchForm(entity: T): void;
    protected abstract getPayload(): T;
    protected abstract isInvalidForm(): boolean;
    protected abstract markFormTouched(): void;
}
