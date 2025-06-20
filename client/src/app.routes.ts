import { AppLayout } from '@/layout/components/app.layout';
import { Login } from '@/pages/auth/login';
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
            }
        ]
    },
    {
        path: 'auth',
        children: [
            { path: 'login', component: Login },
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' },
];
