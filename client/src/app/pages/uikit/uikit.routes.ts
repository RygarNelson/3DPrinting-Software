import { Routes } from '@angular/router';

export default [
    { path: 'button', data: { breadcrumb: 'Button' }, loadComponent: () => import('./buttondemo').then((c) => c.ButtonDemo) },
    { path: 'charts', data: { breadcrumb: 'Charts' }, loadComponent: () => import('./chartdemo').then((c) => c.ChartDemo) },
    { path: 'file', data: { breadcrumb: 'File' }, loadComponent: () => import('./filedemo').then((c) => c.FileDemo) },
    { path: 'formlayout', data: { breadcrumb: 'Form Layout' }, loadComponent: () => import('./formlayoutdemo').then((c) => c.FormLayoutDemo) },
    { path: 'input', data: { breadcrumb: 'Input' }, loadComponent: () => import('./inputdemo').then((c) => c.InputDemo) },
    { path: 'list', data: { breadcrumb: 'List' }, loadComponent: () => import('./listdemo').then((c) => c.ListDemo) },
    { path: 'media', data: { breadcrumb: 'Media' }, loadComponent: () => import('./mediademo').then((c) => c.MediaDemo) },
    { path: 'message', data: { breadcrumb: 'Message' }, loadComponent: () => import('./messagesdemo').then((c) => c.MessagesDemo) },
    { path: 'misc', data: { breadcrumb: 'Misc' }, loadComponent: () => import('./miscdemo').then((c) => c.MiscDemo) },
    { path: 'panel', data: { breadcrumb: 'Panel' }, loadComponent: () => import('./panelsdemo').then((c) => c.PanelsDemo) },
    { path: 'timeline', data: { breadcrumb: 'Timeline' }, loadComponent: () => import('./timelinedemo').then((c) => c.TimelineDemo) },
    { path: 'table', data: { breadcrumb: 'Table' }, loadComponent: () => import('./tabledemo').then((c) => c.TableDemo) },
    { path: 'overlay', data: { breadcrumb: 'Overlay' }, loadComponent: () => import('./overlaydemo').then((c) => c.OverlayDemo) },
    { path: 'tree', data: { breadcrumb: 'Tree' }, loadComponent: () => import('./treedemo').then((c) => c.TreeDemo) },
    { path: 'menu', data: { breadcrumb: 'Menu' }, loadComponent: () => import('./menudemo').then((c) => c.MenuDemo) },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
