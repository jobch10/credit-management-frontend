import { Routes } from '@angular/router';

export const BORROWER_PERSONS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./borrower-persons.component').then((m) => m.BorrowerPersonsComponent)
    },
    {
        path: 'register-borrower-person',
        loadComponent: () => import('./borrower-person-form/borrower-person-form.component').then((m) => m.BorrowerPersonFormComponent)
    },
    {
        path: 'edit-borrower-person/:id',
        loadComponent: () => import('./borrower-person-form/borrower-person-form.component').then((m) => m.BorrowerPersonFormComponent)
    }
];
