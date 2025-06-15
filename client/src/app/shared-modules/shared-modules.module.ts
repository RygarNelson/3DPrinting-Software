import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBreadcrumbComponent } from './breadcrumb/app.breadcrumb.component';
import { AppTopbarComponent } from './topbar/app.topbar.component';
import { InputTextModule } from 'primeng/inputtext';
import { AppSidebarComponent } from './sidebar/app.sidebar.component';
import { RouterModule } from '@angular/router';
import { AppMenuComponent } from './menu/app.menu.component';
import { AppMenuitemComponent } from './menu/app.menuitem.component';
import { AppProfileSidebarComponent } from './profilesidebar/app.profilesidebar.component';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    AppBreadcrumbComponent,
    AppTopbarComponent,
    AppSidebarComponent,
    AppMenuComponent,
    AppMenuitemComponent,
    AppProfileSidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    InputTextModule,
    SidebarModule,
    BadgeModule,
    ButtonModule
  ],
  exports: [
    AppBreadcrumbComponent,
    AppTopbarComponent,
    AppSidebarComponent,
    AppMenuComponent,
    AppMenuitemComponent,
    AppProfileSidebarComponent
  ]
})
export class SharedModulesModule { }
