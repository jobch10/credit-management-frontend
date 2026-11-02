import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { LoadingModalComponent } from './shared/components/loading-modal/loading-modal.component';

@Component({
    selector: 'app-root',
    imports: [ToastModule, ConfirmDialogModule, RouterModule, LoadingModalComponent],
    template: `<p-toast position="bottom-right"></p-toast>
        <p-confirm-dialog></p-confirm-dialog>
        <ui-loading-modal />
        <router-outlet></router-outlet> `
})
export class AppComponent {}
