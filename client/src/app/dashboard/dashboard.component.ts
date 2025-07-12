import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LookupInterface } from 'src/interfaces/lookup.interface';
import { VenditaAnniResponse } from 'src/models/vendita/vendita-anni';
import { AuthService } from 'src/services/auth.service';
import { VenditaService } from 'src/services/vendita.service';
import { FormInputSelectComponent } from 'src/shared/form-input-select/form-input-select.component';
import { DashboardAndamentoComponent } from './dashboard-andamento/dashboard-andamento.component';
import { DashboardStatoComponent } from './dashboard-stato/dashboard-stato.component';

@Component({
    selector: 'app-ecommerce-dashboard',
    standalone: true,
    imports: [
        DashboardAndamentoComponent,
        DashboardStatoComponent,
        FormInputSelectComponent,
        FormsModule
    ],
    providers: [
        VenditaService
    ],
    template: `
        <div class="flex items-center justify-end margin-left-auto">
        <form-input-select
            [data]="anni"
            [filter]="false"
            [showClear]="false"
            [placeholder]="'Seleziona un anno'"
            [(ngModel)]="anno" />
        </div>
        <div class="grid grid-cols-1 gap-8 w-full mt-4">
            <dashboard-stato></dashboard-stato>
        </div>
        <div class="grid grid-cols-1 gap-8 w-full mt-4">
            <dashboard-andamento [anno]="anno"></dashboard-andamento>
        </div>
    `
})
export class DashboardComponent implements OnInit, OnDestroy {

    anni: LookupInterface[] = [];
    anno: number = 0;

    private anniSubscription?: Subscription;
    private checkTokenSubscription?: Subscription;
    
    constructor(
        private authService: AuthService,
        private router: Router,
        private venditaService: VenditaService,
    ) {}

    ngOnInit(): void {
        this.checkToken();
        this.getAnni();
    }

    ngOnDestroy(): void {
        this.anniSubscription?.unsubscribe();
        this.checkTokenSubscription?.unsubscribe();
    }

    private checkToken(): void {
        this.checkTokenSubscription = this.authService.checkToken(localStorage.getItem('token') || '').subscribe((res: any) => {
            if (!res.success) {
                this.authService.removeLocalStorage();
                this.router.navigate(['/login']);
            }
        });
    }

    private getAnni(): void {
        this.anniSubscription = this.venditaService.getAnni().subscribe({
            next: (res: VenditaAnniResponse) => {
                if (res.success) {
                    this.anni = res.data;

                    if (this.anni != null && this.anni.length > 0) {
                        this.anno = this.anni[0].id;
                    }
                }
            },
            error: (err: any) => {
                console.error(err);
            }
        });
      }
}
