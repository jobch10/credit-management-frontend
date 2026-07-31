import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../../service/layout.service';
import { ConfiguratorComponent } from '../configurator/configurator.component';
import { AuthStore } from '@/app/core/store/auth.store';
import { Menu, MenuModule } from 'primeng/menu';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    imports: [RouterModule, CommonModule, StyleClassModule, ConfiguratorComponent, MenuModule]
})
export class TopbarComponent {
    @ViewChild('menu') menu!: Menu;

    layoutService = inject(LayoutService);
    private readonly _router = inject(Router);
    private readonly _store = inject(AuthStore);

    profileItems: MenuItem[] = [
        {
            label: 'Cerrar sesión',
            icon: 'pi pi-sign-out',
            command: () => this.logout()
        }
    ];

    toggleProfileMenu(event: Event) {
        this.menu.toggle(event);
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }

    logout() {
        this._store.logout();
        this._router.navigateByUrl('/auth/login');
    }
}
