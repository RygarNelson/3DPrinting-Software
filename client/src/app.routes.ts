import { Login } from '@/auth/login';
import { AppLayout } from '@/layout/components/app.layout';
import { Notfound } from '@/notfound';
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
        path: 'auth',
        children: [
            { path: 'login', component: Login },
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' },
];
