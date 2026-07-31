import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { AppLayout } from './layout/component/app.layout';
import { MainLayoutComponent } from './layout/layouts/main-layout/main-layout.component';
import { Dashboard } from './pages/dashboard/dashboard';
import { Documentation } from './pages/documentation/documentation';
import { Notfound } from './pages/notfound/notfound';

export const appRoutes: Routes = [
    {
        path: '',
        canActivate: [authGuard],
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () => import('./features/dashboard/admin/admin.component').then((m) => m.AdminDashboardComponent)
            },
            {
                path: 'management',
                loadChildren: () => import('./features/management/management.routes').then((m) => m.MANAGEMENT_ROUTES)
            },
            // {
            //     path: 'personas',
            //     loadChildren: () => import('./features/personas/personas.routes').then((m) => m.PERSONAS_ROUTES)
            // },

            { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
        ]
    },
    {
        path: 'auth',
        canActivate: [guestGuard],
        loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
    },
    {
        path: 'main',
        component: AppLayout,
        children: [
            { path: 's', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./pages/pages.routes') }
        ]
    },
    { path: 's/auth', loadChildren: () => import('./pages/auth/auth.routes') },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/auth' }
];
