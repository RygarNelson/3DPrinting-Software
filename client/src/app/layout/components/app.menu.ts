import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `<ul class="layout-menu"></ul>`,
})
export class AppMenu {
    model: any[] = [];

    ngOnInit() {
        this.model = [];
    }
}
