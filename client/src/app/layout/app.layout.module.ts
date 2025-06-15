import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast'
import { AppLayoutComponent } from './layout/app.layout.component';
import { RouterModule } from '@angular/router';
import { SharedModulesModule } from '../shared-modules/shared-modules.module';
import { LayoutNologComponent } from './layout-nolog/layout-nolog.component';
import { MessageService } from 'primeng/api';

@NgModule({
    declarations: [
        AppLayoutComponent,
        LayoutNologComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        InputTextModule,
        SidebarModule,
        BadgeModule,
        RadioButtonModule,
        InputSwitchModule,
        RippleModule,
        RouterModule,
        SharedModulesModule,
        ToastModule
    ],
    providers: [
        MessageService
    ]
})
export class AppLayoutModule { }
