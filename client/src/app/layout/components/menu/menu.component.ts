import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from '../menuitem/menuitem.component';


@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li
                app-menuitem
                *ngIf="!item.separator"
                [item]="item"
                [index]="i"
                [root]="true"
            ></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `,
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
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
                label: 'Anagrafiche',
                items: [
                    {
                        label: 'Clienti',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/cliente/listing'],
                    },
                ]
            },
            {
                label: 'Magazzino',
                items: [
                    {
                        label: 'Stampanti',
                        icon: 'pi pi-fw pi-print',
                        routerLink: ['/stampante/listing'],
                    },
                    {
                        label: 'Modelli',
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/modello/listing'],
                    }
                ]
            },
            {
                label: 'Amministrazione',
                items: [
                    {
                        label: 'Vendite',
                        icon: 'pi pi-fw pi-dollar',
                        routerLink: ['/vendita/listing'],
                    },
                    {
                        label: 'Spese',
                        icon: 'pi pi-fw pi-receipt',
                        routerLink: ['/spesa/listing'],
                    }
                ]
            }
        ];
    }
}
