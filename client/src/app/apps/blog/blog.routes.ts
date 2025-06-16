import { Routes } from '@angular/router';

export default [
    {
        path: 'list',
        loadComponent: () => import('./list').then((c) => c.List),
        data: { breadcrumb: 'List' }
    },
    {
        path: 'detail',
        loadComponent: () => import('./detail').then((c) => c.Detail),
        data: { breadcrumb: 'Detail' }
    },
    {
        path: 'edit',
        loadComponent: () => import('./edit').then((c) => c.Edit),
        data: { breadcrumb: 'Edit' }
    }
] as Routes;
