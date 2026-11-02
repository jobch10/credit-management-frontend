import { AuthStore } from '@/app/core/store/auth.store';
import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { PermissionModule } from '@/app/shared/interfaces/config';

@Component({
    selector: 'app-menu',
    imports: [CommonModule, MenuItemComponent, RouterModule],
    templateUrl: './menu.component.html'
})
export class MenuComponent {
    private readonly _store = inject(AuthStore);

    readonly model = computed<MenuItem[]>(() => {
        const permissionModules = this._store.permissionModules() ?? [];
        return permissionModules.filter((m) => m.state).map((m) => this.toMenuItem(m));
    });

    private toMenuItem(module: PermissionModule, parentPath = ''): MenuItem {
        const hasChildren = !!module.children?.length;
        const path = module.route ? `${parentPath}${module.route}` : parentPath;

        return {
            label: module.name,
            icon: module.icon ? `${module.icon}` : undefined,
            routerLink: !hasChildren && module.route ? [module.route] : undefined,
            path: hasChildren ? path : undefined,
            items: hasChildren ? module.children!.filter((c) => c.state).map((c) => this.toMenuItem(c, path)) : undefined
        } as MenuItem;
    }
}
