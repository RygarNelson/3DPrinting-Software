import { AppLayout } from '@/layout/components/app.layout';
import { Routes } from '@angular/router';

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
        loadComponent: () => import('./app/login/login').then(c => c.Login),
    },
    {
        path: 'notfound',
        loadComponent: () => import('./app/notfound/notfound').then(c => c.Notfound),
    },
    { path: '**', redirectTo: '/notfound' },
];
