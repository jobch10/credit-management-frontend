import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal, ViewChild } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { DocumentTypeFormComponent } from '../document-type-form/document-type-form.component';
import { TableCustomizableComponent } from '../table-customizable/table-customizable.component';

import { BehaviorSubject, catchError, finalize, map, Observable, of, shareReplay, switchMap, tap, withLatestFrom } from 'rxjs';

import { AttachmentTypeService } from '../../../core/services/attachment-type.service';
import { DocumentService } from '../../../core/services/document.service';

import { toSignal } from '@angular/core/rxjs-interop';
import { DocumentFile, TypeDocument } from '../../interfaces/actors';
import { MessageUtilService } from '../../utils/message-util.service';
import { InputSelectComponent } from '../input-select/input-select.component';
import { TableColumn, TableRowButton } from '../table-customizable/interfaces/table-customizable.interfaces';

@Component({
    selector: 'sc-document-manager',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
        ButtonModule,
        InputTextModule,
        TooltipModule,
        MenuModule,
        TableModule,
        IconFieldModule,
        InputIconModule,
        InputSelectComponent,
        TableCustomizableComponent,
        DocumentTypeFormComponent
    ],
    templateUrl: './document-manager.component.html'
})
export class DocumentManagerComponent implements OnInit, OnChanges {
    @Input() visible = false;
    @Input() entity = '';
    @Input() entityId = 0;
    @Input() title = 'Gestión de Documentos';

    @Output() visibleChange = new EventEmitter<boolean>();

    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
    @ViewChild('menu') menu!: any;

    private readonly documentService = inject(DocumentService);
    private readonly attachmentTypeService = inject(AttachmentTypeService);
    private readonly messageUtilService = inject(MessageUtilService);
    private readonly fb = inject(FormBuilder);

    readonly loading = signal(false);
    readonly uploading = signal(false);
    readonly deleting = signal(false);
    readonly documentTypesLoading = signal(false);
    readonly userInitiatedUpload = signal(false);

    readonly documents = signal<DocumentFile[]>([]);

    private readonly documentTypesRefresh$ = new BehaviorSubject<void>(undefined);

    readonly rawDocumentTypes$: Observable<TypeDocument[]> = this.documentTypesRefresh$.pipe(
        tap(() => this.documentTypesLoading.set(true)),
        switchMap(() =>
            this.attachmentTypeService.findAll().pipe(
                map((types) => types.sort((a, b) => a.code.localeCompare(b.code))),
                catchError(() => of([] as TypeDocument[])), // Add catchError here
                finalize(() => this.documentTypesLoading.set(false))
            )
        ),
        shareReplay(1)
    );

    documentTypes = toSignal(
        this.rawDocumentTypes$.pipe(
            map((types) =>
                types.map((t) => ({
                    label: `${t.code} - ${t.name}`,
                    value: t.id
                }))
            )
        ),
        { initialValue: [] }
    );

    selectedDocumentTypeId: number | null = null;
    showAddTypeDialog = false;
    showManageTypesDialog = false;

    documentTypesTableColumns: TableColumn<TypeDocument>[] = [
        { field: 'code', header: 'Código' },
        { field: 'name', header: 'Nombre' }
    ];

    documentTypesTableRowButtons: TableRowButton<TypeDocument>[] = [
        {
            key: 'delete',
            icon: 'pi pi-trash',
            tooltip: 'Eliminar Tipo de Documento',
            severity: 'danger',
            disabled: (row) => this.isDocumentTypeInUse(row)
        }
    ];

    selectedDoc: DocumentFile | null = null;

    editingDocId: number | null = null;
    readonly editingDocumentTypeId = signal<number | null>(null);

    downloadMenuItems: any[] = [];

    ngOnInit() {
        if (this.entity && this.entityId) this.loadDocuments();
    }

    ngOnChanges() {
        if (this.visible) {
            this.loadDocuments();
            this.cancelEdit(); // Clear any pending inline edits when the main modal opens
        }
    }

    loadDocuments() {
        if (!this.entity || !this.entityId) return;

        this.loading.set(true);

        this.documentService
            .getByEntity(this.entity, this.entityId)
            .pipe(
                withLatestFrom(this.rawDocumentTypes$),
                map(([docs, types]: [DocumentFile[], TypeDocument[]]) => {
                    if (docs.length === 0) return [];
                    return docs.map((doc: DocumentFile) => {
                        const resolvedType = types.find((t: TypeDocument) => t.id === (typeof doc.documentType === 'string' ? parseInt(doc.documentType) : doc.documentType?.id));
                        return {
                            ...doc,
                            documentType: resolvedType || doc.documentType
                        };
                    });
                }),
                finalize(() => this.loading.set(false))
            )
            .subscribe({
                next: (docs) => {
                    this.documents.set(docs);
                },
                error: (err) => console.error('Error loading documents:', err)
            });
    }

    triggerFileSelect() {
        if (!this.uploading()) {
            this.userInitiatedUpload.set(true);
            this.fileInput.nativeElement.click();
        }
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;

        if (!this.userInitiatedUpload()) {
            this.resetFileInput();
            return;
        }
        const files = input.files ? Array.from(input.files) : [];
        if (!files.length) {
            this.resetFileInput();
            return;
        }

        this.messageUtilService.confirm({
            message: `¿Desea subir ${files.length} archivo(s)?`,
            header: 'Confirmación de carga',
            icon: 'pi pi-cloud-upload',
            accept: () => {
                this.uploadFiles(files);
                this.resetFileInput();
            },
            reject: () => {
                this.resetFileInput();
            }
        });
    }

    onFilesDropped(event: DragEvent) {
        event.preventDefault();
        this.userInitiatedUpload.set(true);
        const files = event.dataTransfer?.files ? Array.from(event.dataTransfer.files) : [];
        if (!files.length) {
            this.resetFileInput();
            return;
        }

        this.messageUtilService.confirm({
            message: `¿Desea subir ${files.length} archivo(s) arrastrados?`,
            header: 'Confirmación de carga',
            icon: 'pi pi-cloud-upload',
            accept: () => {
                this.uploadFiles(files);
                this.resetFileInput();
            },
            reject: () => {
                this.resetFileInput();
            }
        });
    }

    uploadFiles(files: File[]) {
        this.uploading.set(true);

        if (this.selectedDocumentTypeId) {
            this.rawDocumentTypes$
                .pipe(
                    map((types) => types.find((t) => t.id === this.selectedDocumentTypeId)),
                    finalize(() => this.uploading.set(false))
                )
                .subscribe({
                    next: (selectedType) => {
                        this.documentService.uploadFiles(files, this.entity, this.entityId, selectedType).subscribe({
                            next: (docs) => this.documents.update((currentDocs) => [...currentDocs, ...docs]),
                            error: () => {}
                        });
                    },
                    error: () => {}
                });
        } else {
            this.documentService
                .uploadFiles(files, this.entity, this.entityId)
                .pipe(finalize(() => this.uploading.set(false)))
                .subscribe({
                    next: (docs) => this.documents.update((currentDocs) => [...currentDocs, ...docs]),
                    error: () => {}
                });
        }
    }

    startEdit(doc: DocumentFile) {
        this.editingDocId = doc.id!;

        const docType = doc.documentType;
        this.editingDocumentTypeId.set(typeof docType !== 'string' && docType && 'id' in docType ? docType.id : null);
    }

    saveEdit(doc: DocumentFile) {
        if (!this.editingDocId || !doc.id || !this.editingDocumentTypeId()) {
            return;
        }

        this.rawDocumentTypes$.pipe(map((types) => types.find((t) => t.id === this.editingDocumentTypeId()))).subscribe((t) => {
            if (!t) {
                return;
            }
            const documentTypeValue = t.id?.toString() || t.code?.trim() || t.name?.trim();

            const dto: Partial<DocumentFile> = {
                entity: doc.entity,
                entityId: doc.entityId,
                fileName: doc.fileName,
                fileUrl: doc.fileUrl,
                issueDate: doc.issueDate,
                documentType: documentTypeValue
            };

            this.documentService.update(doc.id!, dto).subscribe((res) => {
                const i = this.documents().findIndex((d) => d.id === res.id);
                if (i !== -1) {
                    const updated = {
                        ...res,
                        documentType: t
                    } as DocumentFile;
                    this.documents.update((currentDocs) => {
                        const newDocs = [...currentDocs];
                        newDocs[i] = updated;
                        return newDocs;
                    });
                }
                this.cancelEdit();
            });
        });
    }

    cancelEdit() {
        this.editingDocId = null;
        this.editingDocumentTypeId.set(null);
    }

    openAddDocumentTypeDialog() {
        this.showAddTypeDialog = true;
    }

    onDocumentTypeFormSave(type: TypeDocument) {
        this.selectedDocumentTypeId = type.id || null;
        this.documentTypesRefresh$.next();
        this.showAddTypeDialog = false;
        this.resetFileInput();
    }

    openManageTypesDialog() {
        this.showManageTypesDialog = true;
        this.documentTypesRefresh$.next(); // Refresh list when opening
        this.cancelEdit(); // Clear any pending inline edits when opening the dialog
        this.resetFileInput();
    }

    closeManageTypesDialog() {
        this.showManageTypesDialog = false;
        this.cancelEdit(); // Clear any pending inline edits
        this.resetFileInput();
    }

    onDocumentTypeAction(event: { action: string; row: TypeDocument }) {
        if (event.action === 'delete') {
            this.deleteDocumentType(event.row);
        }
    }

    isDocumentTypeInUse(type: TypeDocument): boolean {
        return this.documents().some((doc) => {
            if (typeof doc.documentType === 'object' && doc.documentType !== null) {
                return doc.documentType.id === type.id;
            }
            return false;
        });
    }

    deleteDocumentType(type: TypeDocument) {
        if (!type.id) return;

        if (this.isDocumentTypeInUse(type)) {
            this.messageUtilService.getAlertWarning(`El tipo de documento "${type.code} - ${type.name}" está en uso y no puede ser eliminado.`);
            return;
        }

        this.messageUtilService.confirm({
            message: `¿Desea eliminar el tipo de documento "${type.code} - ${type.name}"?`,
            header: 'Confirmación de eliminación',
            icon: 'pi pi-trash',
            accept: () => {
                this.attachmentTypeService.delete(type.id!).subscribe({
                    next: () => {
                        this.documentTypesRefresh$.next();
                        this.messageUtilService.getAlertSuccess(`Tipo de documento "${type.code} - ${type.name}" eliminado correctamente.`);
                    },
                    error: (err) => this.handleAttachmentTypeError(err, 'eliminar')
                });
            }
        });
    }

    deleteDocument(doc: DocumentFile) {
        if (!doc.id) return;

        this.messageUtilService.confirm({
            message: `¿Desea eliminar el documento "${doc.fileName}"?`,
            header: 'Confirmación de eliminación',
            icon: 'pi pi-trash',
            accept: () => {
                this.deleting.set(true);
                this.documentService
                    .delete(doc.id!)
                    .pipe(finalize(() => this.deleting.set(false)))
                    .subscribe({
                        next: () => {
                            this.documents.update((currentDocs) => currentDocs.filter((d) => d.id !== doc.id));
                            this.messageUtilService.getAlertSuccess(`Documento "${doc.fileName}" eliminado correctamente.`);
                        },
                        error: (err) => this.handleDocumentError(err, 'eliminar')
                    });
            }
        });
    }

    private handleAttachmentTypeError(error: any, operation: 'eliminar'): void {
        console.error(`Error al ${operation} el tipo de documento:`, error);
        this.messageUtilService.getAlertWarning(`No se pudo ${operation} el tipo de documento. Intente nuevamente.`);
    }

    private handleDocumentError(error: any, operation: 'eliminar'): void {
        console.error(`Error al ${operation} el documento:`, error);
        this.messageUtilService.getAlertWarning(`No se pudo ${operation} el documento. Intente nuevamente.`);
    }

    private isPreviewable(doc: DocumentFile): boolean {
        const ext = doc.fileName?.split('.').pop()?.toLowerCase() || '';
        return ['pdf', 'jpg', 'jpeg', 'png'].includes(ext);
    }

    openDownloadMenu(event: Event, doc: DocumentFile) {
        this.selectedDoc = doc;

        const previewable = this.isPreviewable(doc);

        this.downloadMenuItems = [
            ...(previewable
                ? [
                      {
                          label: 'Ver',
                          icon: 'pi pi-eye',
                          command: () => this.viewFile(doc)
                      }
                  ]
                : []),
            {
                label: 'Descargar',
                icon: 'pi pi-download',
                command: () => this.downloadFile(doc)
            }
        ];

        this.menu.toggle(event);
    }

    viewFile(doc: DocumentFile) {
        if (!doc.fileUrl) return;

        this.documentService.downloadFile(doc.fileUrl).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                window.open(url, '_blank');
            },
            error: (err) => {
                this.messageUtilService.getAlertWarning('No se pudo visualizar el documento. Intente nuevamente.');
            }
        });
    }

    downloadFile(doc: DocumentFile) {
        if (!doc.fileUrl) return;

        this.documentService.downloadFile(doc.fileUrl).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = doc.fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            },
            error: (err) => {
                this.messageUtilService.getAlertWarning('No se pudo descargar el documento. Intente nuevamente.');
            }
        });
    }

    getFileIcon(fileName: string): string {
        const ext = fileName.split('.').pop()?.toLowerCase();

        if (ext === 'pdf') return 'pi pi-file-pdf text-red-500';
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'].includes(ext || '')) return 'pi pi-image text-blue-500';
        if (['xls', 'xlsx', 'csv'].includes(ext || '')) return 'pi pi-file-excel text-green-500';
        if (['doc', 'docx'].includes(ext || '')) return 'pi pi-file-word text-blue-700';
        if (['ppt', 'pptx'].includes(ext || '')) return 'pi pi-file-powerpoint text-orange-500';
        if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext || '')) return 'pi pi-file-archive text-purple-500';
        if (['txt', 'log'].includes(ext || '')) return 'pi pi-file-alt text-gray-500';
        if (['mp3', 'wav', 'ogg', 'flac'].includes(ext || '')) return 'pi pi-file-audio text-pink-500';
        if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(ext || '')) return 'pi pi-file-video text-teal-500';
        if (['js', 'ts', 'html', 'css', 'json', 'xml', 'java', 'py', 'c', 'cpp', 'h', 'hpp'].includes(ext || '')) return 'pi pi-file-code text-indigo-500';

        return 'pi pi-file';
    }

    getDocumentTypeLabel(documentType?: TypeDocument | string): string {
        if (!documentType) return 'Sin tipo';
        if (typeof documentType === 'string') return documentType;
        return documentType.name || documentType.code || 'Sin tipo';
    }

    trackByDoc(index: number, doc: DocumentFile) {
        return doc.id;
    }

    close() {
        this.visible = false;
        this.visibleChange.emit(false);
        this.cancelEdit(); // Ensure any pending inline edits are cleared when the main modal closes
        this.resetFileInput();
    }

    private resetFileInput(): void {
        if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
        }
        this.userInitiatedUpload.set(false);
    }
}
