import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/components/layout/layout.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            {
                path: '',
                loadComponent: () => import('./app/dashboard/dashboard.component').then(c => c.DashboardComponent),
                data: { breadcrumb: 'Dashboard' },
            }
        ]
    },
    {
        path: 'login',
        loadComponent: () => import('./app/login/login.component').then(c => c.Login),
    },
    {
        path: 'notfound',
        loadComponent: () => import('./app/notfound/notfound.component').then(c => c.Notfound),
    },
    { path: '**', redirectTo: '/notfound' },
];
