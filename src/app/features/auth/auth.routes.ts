import { AuthLayoutComponent } from '@/app/layout/layouts/auth-layout/auth-layout.component';
import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'login',
                loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent)
            },
            // {
            //     path: 'register',
            //     loadComponent: () => import('./pages/register/register.component').then((m) => m.RegisterComponent)
            // },
            { path: '', pathMatch: 'full', redirectTo: 'login' }
        ]
    }
];
