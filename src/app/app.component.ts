import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-root',
    imports: [ToastModule, ConfirmDialogModule, RouterModule],
    template: `<p-toast position="bottom-right"></p-toast>
        <p-confirm-dialog></p-confirm-dialog>
        <router-outlet></router-outlet> `
})
export class AppComponent {}
