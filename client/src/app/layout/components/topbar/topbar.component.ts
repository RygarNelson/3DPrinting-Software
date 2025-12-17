import { LayoutService } from '@/layout/service/layout.service';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { StyleClassModule } from 'primeng/styleclass';
import { User } from 'src/models/User';
import { AuthService } from 'src/services/auth.service';
import { AppBreadcrumb } from '../breadcrumb/breadcrumb.component';


@Component({
    selector: '[app-topbar]',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppBreadcrumb, InputTextModule, ButtonModule, IconFieldModule, InputIconModule],
    template: `<div class="layout-topbar">
        <div class="topbar-start">
            <button #menubutton type="button" class="topbar-menubutton p-link p-trigger" (click)="onMenuButtonClick()">
                <i class="pi pi-bars"></i>
            </button>
            <nav app-breadcrumb class="topbar-breadcrumb"></nav>
        </div>

        <div class="topbar-end">
            <ul class="topbar-menu">
                <li>
                    <button pButton
                            type="button" 
                            class="p-button-rounded p-button-secondary p-button-text"
                            [label]="user.name + ' ' + user.surname" 
                            icon="pi pi-user"
                            iconPos="right"
                            (click)="onProfileButtonClick()" >
                    </button>
                </li>
            </ul>
        </div>
    </div>`
})
export class AppTopbar implements OnInit {
    @ViewChild('menubutton') menuButton!: ElementRef;

    public user: User = new User();

    constructor(public layoutService: LayoutService, private authService: AuthService) {}

    ngOnInit(): void {
        this.user = this.authService.getUserInformation();
    }

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onProfileButtonClick() {
        this.layoutService.showProfileSidebar();
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }
}
