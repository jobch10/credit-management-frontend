import { Routes } from '@angular/router';

export const MANAGEMENT_ROUTES: Routes = [
    // {
    //     path: '',
    //     loadComponent: () => import('./usuarios/usuarios.component').then((m) => m.UsuariosComponent)
    // },
    {
        path: 'users',
        loadComponent: () => import('./users/users.component').then((m) => m.UsersComponent)
    },
    {
        path: 'roles',
        loadChildren: () => import('./roles/roles.routes').then((m) => m.ROLES_ROUTES)
    },
    {
        path: 'modules',
        loadComponent: () => import('./modules/modules.component').then((m) => m.ModulesComponent)
    },
    {
        path: 'actions',
        loadComponent: () => import('./actions/actions.component').then((m) => m.ActionsComponent)
    }
];
