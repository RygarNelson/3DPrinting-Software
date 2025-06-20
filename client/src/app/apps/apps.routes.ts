import { Routes } from '@angular/router';

export default [
    {
        path: 'blog',
        loadChildren: () => import('./blog/blog.routes'),
        data: { breadcrumb: 'Blog' }
    },
    {
        path: 'chat',
        loadComponent: () => import('./chat').then((c) => c.Chat),
        data: { breadcrumb: 'Chat' }
    },
    {
        path: 'files',
        loadComponent: () => import('./files').then((c) => c.Files),
        data: { breadcrumb: 'Files' }
    },
    {
        path: 'mail',
        loadChildren: () => import('./mail/mail.routes'),
        data: { breadcrumb: 'Mail' }
    },
    {
        path: 'tasklist',
        loadComponent: () => import('./tasklist').then((c) => c.TaskList),
        data: { breadcrumb: 'Tasklist' }
    },
    {
        path: 'kanban',
        loadComponent: () => import('./kanban').then((c) => c.Kanban),
        data: { breadcrumb: 'Kanban' }
    }
] as Routes;
