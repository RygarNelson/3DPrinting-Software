import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User.model';
import { LayoutService } from 'src/app/services/app.layout.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    standalone: false
})
export class AppTopbarComponent implements OnInit {

    public user: User = new User();

    constructor(public layoutService: LayoutService, private authService: AuthService) { }

    ngOnInit(): void {
        this.user = this.authService.getUserInformation();
    }

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onProfileButtonClick() {
        this.layoutService.showProfileSidebar();
    }
    
}