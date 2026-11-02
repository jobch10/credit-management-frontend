import { Routes } from '@angular/router';

export const BORROWERS_ROUTES: Routes = [
    {
        path: 'persons',
        loadChildren: () => import('./borrower-persons/borrower-persons.routes').then((m) => m.BORROWER_PERSONS_ROUTES)
    }
];
