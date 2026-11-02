import { Routes } from '@angular/router';

export const INVESTOR_PERSONS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./investor-persons.component').then((m) => m.InvestorPersonsComponent)
    },
    {
        path: 'register-investor-person',
        loadComponent: () => import('./investor-person-form/investor-person-form.component').then((m) => m.InvestorPersonFormComponent)
    },
    {
        path: 'edit-investor-person/:id',
        loadComponent: () => import('./investor-person-form/investor-person-form.component').then((m) => m.InvestorPersonFormComponent)
    }
];
