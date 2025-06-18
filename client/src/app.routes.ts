import { AppLayout } from '@/layout/components/layout/layout.component';
import { Notfound } from '@/notfound/notfound';
import { Routes } from '@angular/router';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            {
                path: '',
                loadComponent: () => import('./app/dashboard/dashboard.component').then(c => c.EcommerceDashboard),
                data: { breadcrumb: 'Dashboard' },
            },
        ],
    },
    {
        path: 'auth',
        loadComponent: () => import('./app/auth/auth.component').then(c => c.Login),
    },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' },
];
