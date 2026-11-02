import { Component, EventEmitter, Input, Output, inject, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { AttachmentTypeService } from '../../../core/services/attachment-type.service';
import { TypeDocument } from '../../interfaces/actors';
import { MessageUtilService } from '../../utils/message-util.service';

@Component({
    selector: 'sc-document-type-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule],
    templateUrl: './document-type-form.component.html',
    styleUrl: './document-type-form.component.scss'
})
export class DocumentTypeFormComponent implements OnInit, OnChanges {
    @Input() visible = false;
    @Input() typeDocument: TypeDocument | null = null;

    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() save = new EventEmitter<TypeDocument>();

    loading = false;

    private readonly fb = inject(FormBuilder);
    private readonly attachmentTypeService = inject(AttachmentTypeService);
    private readonly messageUtilService = inject(MessageUtilService);

    form = this.fb.group({
        id: [null as number | null],
        code: ['', [Validators.required, Validators.maxLength(10)]],
        name: ['', [Validators.required, Validators.maxLength(50)]]
    });

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible'] && changes['visible'].currentValue && this.typeDocument) {
            this.form.patchValue(this.typeDocument);
        } else if (changes['visible'] && !changes['visible'].currentValue) {
            this.form.reset();
        }
    }

    onSave(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.messageUtilService.getAlertWarning('Por favor, complete todos los campos requeridos.');
            return;
        }

        this.loading = true;
        const { id, code, name } = this.form.value;
        const payload: Partial<TypeDocument> = { code: code!, name: name! };

        if (id) {
            // Actualizamos el tipo de documento existente
            this.attachmentTypeService.update(id, payload).subscribe({
                next: (type: TypeDocument) => {
                    this.messageUtilService.getAlertSuccess(`Tipo de documento "${type.code} - ${type.name}" actualizado correctamente.`);
                    this.save.emit(type);
                    this.close();
                    this.loading = false;
                },
                error: (err) => {
                    this.handleAttachmentTypeError(err, 'actualizar');
                    this.loading = false;
                }
            });
        } else {
            // Creamos un nuevo tipo de documento
            this.attachmentTypeService.create(payload).subscribe({
                next: (type: TypeDocument) => {
                    this.messageUtilService.getAlertSuccess(`Tipo de documento "${type.code} - ${type.name}" agregado correctamente.`);
                    this.save.emit(type);
                    this.close();
                    this.loading = false;
                },
                error: (err) => {
                    this.handleAttachmentTypeError(err, 'crear');
                    this.loading = false;
                }
            });
        }
    }

    close(): void {
        this.visible = false;
        this.visibleChange.emit(false);
        this.form.reset();
    }

    private handleAttachmentTypeError(error: any, operation: 'crear' | 'actualizar'): void {
        console.error(`Error al ${operation} el tipo de documento:`, error);
        this.messageUtilService.getAlertWarning(`No se pudo ${operation} el tipo de documento. Intente nuevamente.`);
    }
}
