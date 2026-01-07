import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from '../menuitem/menuitem.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [AppMenuitem, RouterModule],
  template: `<ul class="layout-menu">
    @for (item of model; track item; let i = $index) {
      @if (!item.separator) {
        <li app-menuitem [item]="item" [index]="i" [root]="true"></li>
      }
      @if (item.separator) {
        <li class="menu-separator"></li>
      }
    }
  </ul>`
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
            routerLink: ['/']
          }
        ]
      },
      {
        label: 'Anagrafiche',
        items: [
          {
            label: 'Clienti',
            icon: 'pi pi-fw pi-users',
            routerLink: ['/cliente/listing']
          },
          {
            label: 'Conti Bancari',
            icon: 'pi pi-fw pi-credit-card',
            routerLink: ['/conto-bancario/listing']
          }
        ]
      },
      {
        label: 'Magazzino',
        items: [
          {
            label: 'Stampanti',
            icon: 'pi pi-fw pi-print',
            routerLink: ['/stampante/listing']
          },
          {
            label: 'Modelli',
            icon: 'pi pi-fw pi-box',
            routerLink: ['/modello/listing']
          }
        ]
      },
      {
        label: 'Amministrazione',
        items: [
          {
            label: 'Vendite',
            icon: 'pi pi-fw pi-dollar',
            routerLink: ['/vendita/listing']
          },
          {
            label: 'Spese',
            icon: 'pi pi-fw pi-receipt',
            routerLink: ['/spesa/listing']
          }
        ]
      }
    ];
  }
}
