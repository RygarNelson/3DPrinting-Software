import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { LoggedGuard } from './auth-guards/logged.guard';
import { NologgedGuard } from './auth-guards/nologged.guard';
import { LayoutNologComponent } from './layout/layout-nolog/layout-nolog.component';
import { AppLayoutComponent } from './layout/layout/app.layout.component';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled',
};

const routes: Routes = [
    {
        path: '', 
        component: AppLayoutComponent,
        children: [
            { path: '', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) }
        ],
        canActivate: [LoggedGuard]
    },
    {
        path: '',
        component: LayoutNologComponent,
        children: [
            { path: 'auth', data: { breadcrumb: 'Auth' }, loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
        ],
        canActivate: [NologgedGuard]
    },
    { path: 'notfound', loadChildren: () => import('./notfound/notfound.module').then(m => m.NotfoundModule) },
    { path: '**', redirectTo: '/notfound' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
