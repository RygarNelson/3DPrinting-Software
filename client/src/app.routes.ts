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
            },
            {
                path: 'stampante',
                redirectTo: 'stampante/listing',
                pathMatch: 'full',
            },
            {
                path: 'stampante/listing',
                loadComponent: () => import('./app/stampante/stampante-listing/stampante-listing.component').then(c => c.StampanteListingComponent),
                data: { breadcrumb: 'Stampanti' },
            },
            {
                path: 'stampante/manager',
                loadComponent: () => import('./app/stampante/stampante-manager/stampante-manager.component').then(c => c.StampanteManagerComponent),
                data: { breadcrumb: 'Nuova Stampante' },
            },
            {
                path: 'stampante/manager/:id',
                loadComponent: () => import('./app/stampante/stampante-manager/stampante-manager.component').then(c => c.StampanteManagerComponent),
                data: { breadcrumb: 'Modifica Stampante' },
            },
            {
                path: 'modello',
                redirectTo: 'modello/listing',
                pathMatch: 'full',
            },
            {
                path: 'modello/listing',
                loadComponent: () => import('./app/modello/modello-listing/modello-listing.component').then(c => c.ModelloListingComponent),
                data: { breadcrumb: 'Modelli' },
            },
            {
                path: 'modello/manager',
                loadComponent: () => import('./app/modello/modello-manager/modello-manager.component').then(c => c.ModelloManagerComponent),
                data: { breadcrumb: 'Nuovo Modello' },
            },
            {
                path: 'modello/manager/:id',
                loadComponent: () => import('./app/modello/modello-manager/modello-manager.component').then(c => c.ModelloManagerComponent),
                data: { breadcrumb: 'Modifica Modello' },
            },
            {
                path: 'cliente',
                redirectTo: 'cliente/listing',
                pathMatch: 'full',
            },
            {
                path: 'cliente/listing',
                loadComponent: () => import('./app/cliente/cliente-listing/cliente-listing.component').then(c => c.ClienteListingComponent),
                data: { breadcrumb: 'Clienti' },
            },
            {
                path: 'cliente/manager',
                loadComponent: () => import('./app/cliente/cliente-manager/cliente-manager.component').then(c => c.ClienteManagerComponent),
                data: { breadcrumb: 'Nuovo Cliente' },
            },
            {
                path: 'cliente/manager/:id',
                loadComponent: () => import('./app/cliente/cliente-manager/cliente-manager.component').then(c => c.ClienteManagerComponent),
                data: { breadcrumb: 'Modifica Cliente' },
            },
            {
                path: 'vendita',
                redirectTo: 'vendita/listing',
                pathMatch: 'full',
            },
            {
                path: 'vendita/listing',
                loadComponent: () => import('./app/vendita/vendita-listing/vendita-listing.component').then(c => c.VenditaListingComponent),
                data: { breadcrumb: 'Vendite' },
            },
            {
                path: 'vendita/manager',
                loadComponent: () => import('./app/vendita/vendita-manager/vendita-manager.component').then(c => c.VenditaManagerComponent),
                data: { breadcrumb: 'Nuova Vendita' },
            },
            {
                path: 'vendita/manager/:id',
                loadComponent: () => import('./app/vendita/vendita-manager/vendita-manager.component').then(c => c.VenditaManagerComponent),
                data: { breadcrumb: 'Modifica Vendita' },
            },
            {
                path: 'spesa',
                redirectTo: 'spesa/listing',
                pathMatch: 'full',
            },
            {
                path: 'spesa/listing',
                loadComponent: () => import('./app/spesa/spesa-listing/spesa-listing.component').then(c => c.SpesaListingComponent),
                data: { breadcrumb: 'Spese' },
            },
            {
                path: 'spesa/manager',
                loadComponent: () => import('./app/spesa/spesa-manager/spesa-manager.component').then(c => c.SpesaManagerComponent),
                data: { breadcrumb: 'Nuova Spesa' },
            },
            {
                path: 'spesa/manager/:id',
                loadComponent: () => import('./app/spesa/spesa-manager/spesa-manager.component').then(c => c.SpesaManagerComponent),
                data: { breadcrumb: 'Modifica Spesa' },
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
