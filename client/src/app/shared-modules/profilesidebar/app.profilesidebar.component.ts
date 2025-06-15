import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/models/User.model';
import { AuthService } from 'src/app/services/auth.service';
import { LayoutService } from '../../services/app.layout.service';

@Component({
    selector: 'app-profilemenu',
    templateUrl: './app.profilesidebar.component.html',
    standalone: false
})
export class AppProfileSidebarComponent implements OnInit {

    public user: User = new User();

    constructor(
        public layoutService: LayoutService,
        private router: Router,
        private messageService: MessageService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.user = this.authService.getUserInformation();
    }

    get visible(): boolean {
        return this.layoutService.state.profileSidebarVisible;
    }

    set visible(_val: boolean) {
        this.layoutService.state.profileSidebarVisible = _val;
    }

    logout(): void {
        this.visible = false;
        this.authService.removeLocalStorage();
        setTimeout(() => this.messageService.add({
			severity: 'success',
			detail: 'Logout effettuato correttamente!'
		}), 100);
        this.router.navigate(['/auth', 'login']);
    }
}