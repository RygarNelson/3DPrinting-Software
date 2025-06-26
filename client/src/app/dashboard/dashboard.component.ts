import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { DashboardAndamentoComponent } from './dashboard-andamento/dashboard-andamento.component';

@Component({
    selector: 'app-ecommerce-dashboard',
    standalone: true,
    imports: [
        DashboardAndamentoComponent
    ],
    template: `
        <div class="grid grid-cols-1 gap-8 w-full">
            <dashboard-andamento></dashboard-andamento>
        </div>
    `
})
export class DashboardComponent implements OnInit {
    
    constructor(private authService: AuthService, private router: Router) {}

    ngOnInit(): void {
        this.authService.checkToken(localStorage.getItem('token') || '').subscribe((res: any) => {
            if (!res.success) {
                this.authService.removeLocalStorage();
                this.router.navigate(['/login']);
            }
        });
    }
}
