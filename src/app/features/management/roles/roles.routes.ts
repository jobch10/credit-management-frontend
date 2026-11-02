import { Routes } from '@angular/router';

export const ROLES_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./roles.component').then((m) => m.RolesComponent)
    },
    {
        path: 'role-permissions/:id',
        loadComponent: () => import('./role-permissions/role-permissions.component').then((m) => m.RolePermissionsComponent)
    }
];
