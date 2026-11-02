import { Routes } from '@angular/router';

export const LOANS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./loans.component').then((m) => m.LoansComponent)
    },
    {
        path: 'new',
        loadComponent: () => import('./loan-form/loan-form.component').then((m) => m.LoanFormComponent)
    },
    {
        path: ':id',
        loadComponent: () => import('./loan-detail/loan-detail.component').then((m) => m.LoanDetailComponent)
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./loan-form/loan-form.component').then((m) => m.LoanFormComponent)
    }
];
