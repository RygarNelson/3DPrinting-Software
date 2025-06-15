import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', data: {breadcrumb: 'Dashboard'}, component: DashboardComponent },
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
