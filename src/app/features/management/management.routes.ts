import { Routes } from '@angular/router';

export const MANAGEMENT_ROUTES: Routes = [
    // {
    //     path: '',
    //     loadComponent: () => import('./usuarios/usuarios.component').then((m) => m.UsuariosComponent)
    // },
    // {
    //     path: 'usuarios',
    //     loadChildren: () => import('./usuarios/usuarios.routes').then((m) => m.USUARIOS_ROUTES)
    // },
    // {
    //     path: 'roles',
    //     loadChildren: () => import('./roles/roles.routes').then((m) => m.ROLES_ROUTES)
    // },
    // {
    //     path: 'modulos',
    //     loadChildren: () => import('./modulos/modulos.routes').then((m) => m.MODULOS_ROUTES)
    // },
    {
        path: 'actions',
        loadComponent: () => import('./actions/actions.component').then((m) => m.ActionsComponent)
    }
];
