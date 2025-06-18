import { LayoutService } from '@/layout/service/layout.service';
import { Component, computed } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';

@Component({
    selector: '[app-profilesidebar]',
    imports: [
        ButtonModule,
        DrawerModule,
        BadgeModule,
    ],
    templateUrl: './profilesidebar.component.html',
})
export class AppProfileSidebar {
    constructor(public layoutService: LayoutService) {}

    visible = computed(
        () => this.layoutService.layoutState().profileSidebarVisible,
    );

    onDrawerHide() {
        this.layoutService.layoutState.update((state) => ({
            ...state,
            profileSidebarVisible: false,
        }));
    }
}
