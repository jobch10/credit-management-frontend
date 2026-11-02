import { Routes } from '@angular/router';

export const FINANCIAL_ACTORS_ROUTES: Routes = [
    {
        path: 'borrowers',
        children: [
            {
                path: '',
                loadChildren: () => import('./borrowers/borrowers.routes').then((m) => m.BORROWERS_ROUTES)
            }
        ]
    },
    {
        path: 'investors',
        children: [
            {
                path: '',
                loadChildren: () => import('./investors/investors.routes').then((m) => m.INVESTORS_ROUTES)
            }
        ]
    }
];
