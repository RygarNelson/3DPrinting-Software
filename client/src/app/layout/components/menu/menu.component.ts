import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from '../menuitem/menuitem.component';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    templateUrl: './menu.component.html'
})
export class AppMenu {
    model: MenuItem[] = [
        {
            label: 'Dashboards',
            items: [
                {
                    label: 'Dashboard',
                    icon: 'pi pi-fw pi-home',
                    routerLink: ['/'],
                },
            ]
        },
        {
            label: 'Magazzino',
            icon: 'pi pi-th-large',
            items: [
                {
                    label: 'Stampanti',
                    icon: 'pi pi-fw pi-image',
                },
            ],
        }
    ];
}
