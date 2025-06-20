import { Routes } from '@angular/router';

export default [
    {
        path: '',
        loadComponent: () => import('.').then((c) => c.MailAppComponent),
        children: [
            { path: '', redirectTo: 'inbox', pathMatch: 'full' },
            {
                path: 'inbox',
                data: { breadcrumb: 'Inbox' },
                loadComponent: () => import('./mail-inbox').then((c) => c.MailInboxComponent)
            },
            {
                path: 'detail/:id',
                data: { breadcrumb: 'Detail' },
                loadComponent: () => import('./mail-detail').then((c) => c.MailDetailComponent)
            },
            {
                path: 'compose',
                data: { breadcrumb: 'Compose' },
                loadComponent: () => import('./mail-compose').then((c) => c.MailComposeComponent)
            },
            {
                path: 'archived',
                data: { breadcrumb: 'Archived' },
                loadComponent: () => import('./mail-archive').then((c) => c.MailArchiveComponent)
            },
            {
                path: 'important',
                data: { breadcrumb: 'Important' },
                loadComponent: () => import('./mail-important').then((c) => c.MailImportantComponent)
            },
            {
                path: 'sent',
                data: { breadcrumb: 'Sent' },
                loadComponent: () => import('./mail-sent').then((c) => c.MailSentComponent)
            },
            {
                path: 'spam',
                data: { breadcrumb: 'Spam' },
                loadComponent: () => import('./mail-spam').then((c) => c.MailSpamComponent)
            },
            {
                path: 'starred',
                data: { breadcrumb: 'Starred' },
                loadComponent: () => import('./mail-starred').then((c) => c.MailStarredComponent)
            },
            {
                path: 'trash',
                data: { breadcrumb: 'Trash' },
                loadComponent: () => import('./mail-trash').then((c) => c.MailTrashComponent)
            }
        ]
    }
] as Routes;
