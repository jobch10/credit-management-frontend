import { LoadingService } from '@/app/core/services/loading.service';
import { Component, inject } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
    selector: 'ui-loading-modal',
    imports: [Dialog, ProgressSpinner],
    template: `
        <p-dialog [visible]="loading.visible()" [modal]="true" [closable]="false" [closeOnEscape]="false" [draggable]="false" [resizable]="false" [showHeader]="false" [style]="{ width: '18rem' }" styleClass="loading-dialog">
            <div class="flex flex-col items-center gap-4 py-4">
                <p-progressspinner strokeWidth="4" [style]="{ width: '3rem', height: '3rem' }" />
                <span class="text-center font-medium">{{ loading.message() }}</span>
            </div>
        </p-dialog>
    `
})
export class LoadingModalComponent {
    protected readonly loading = inject(LoadingService);
}
