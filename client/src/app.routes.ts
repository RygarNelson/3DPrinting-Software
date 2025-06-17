import { AppLayout } from '@/layout/components/app.layout';
import { Notfound } from '@/pages/notfound/notfound';
import { Routes } from '@angular/router';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            {
                path: '',
                loadComponent: () => import('./app/pages/dashboards/ecommercedashboard').then(c => c.EcommerceDashboard),
                data: { breadcrumb: 'E-Commerce Dashboard' },
            },
        ],
    },
    { path: 'notfound', component: Notfound },
    {
        path: 'auth',
        loadComponent: () => import('./app/pages/auth/login').then(c => c.Login),
    },
    { path: '**', redirectTo: '/notfound' },
];
