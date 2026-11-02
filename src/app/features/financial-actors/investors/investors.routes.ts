import { Routes } from '@angular/router';

export const INVESTORS_ROUTES: Routes = [
    {
        path: 'persons',
        loadChildren: () => import('./investor-persons/investor-persons.routes').then((m) => m.INVESTOR_PERSONS_ROUTES)
    }
];
