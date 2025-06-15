import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardsRoutingModule } from './dashboards-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { KnobModule } from 'primeng/knob';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        DashboardComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DashboardsRoutingModule,
        KnobModule,
        DropdownModule,
        ChartModule,
        TableModule,
        RatingModule
    ]
})
export class DashboardsModule { }
