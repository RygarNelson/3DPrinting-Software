import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/components/layout/layout.component';
import { LoggedGuard } from './guards/logged.guard';
import { NotLoggedGuard } from './guards/not-logged.guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [LoggedGuard],
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
        canActivate: [NotLoggedGuard],
        loadComponent: () => import('./app/login/login.component').then(c => c.Login),
    },
    {
        path: 'notfound',
        loadComponent: () => import('./app/notfound/notfound.component').then(c => c.Notfound),
    },
    { path: '**', redirectTo: '/notfound' },
];
