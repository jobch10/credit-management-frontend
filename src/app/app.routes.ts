import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { MainLayoutComponent } from './layout/layouts/main-layout/main-layout.component';

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
            {
                path: 'actors',
                loadChildren: () => import('./features/financial-actors/financial-actors.routes').then((m) => m.FINANCIAL_ACTORS_ROUTES)
            },
            {
                path: 'loans',
                loadChildren: () => import('./features/loans/loans.routes').then((m) => m.LOANS_ROUTES)
            },

            { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
        ]
    },
    {
        path: 'auth',
        canActivate: [guestGuard],
        loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
    },
    { path: '**', redirectTo: '/auth' }
];
