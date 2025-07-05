import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';
import { VenditaStatoModel, VenditaStatoResponse } from 'src/models/vendita/vendita-stato';
import { VenditaService } from 'src/services/vendita.service';

@Component({
  selector: 'dashboard-stato',
  imports: [
    CardModule,
    SkeletonModule
  ],
  providers: [
    VenditaService
  ],
  templateUrl: './dashboard-stato.component.html',
  styleUrl: './dashboard-stato.component.scss'
})
export class DashboardStatoComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  stato: VenditaStatoModel = new VenditaStatoModel();

  private statoSubscription?: Subscription;
  private loadingTimeout?: number;

  constructor(private venditaService: VenditaService) {}

  ngOnInit(): void {
    this.getStatoVendite();
  }

  ngOnDestroy(): void {
    this.statoSubscription?.unsubscribe();
    clearTimeout(this.loadingTimeout);
  }

  private getStatoVendite(): void {
    this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);

    this.statoSubscription = this.venditaService.getStatoVendite().subscribe((res: VenditaStatoResponse) => {
      if (res.success) {
        this.stato = res.data;
      }

      window.clearTimeout(this.loadingTimeout);
      this.loading = false;
    });
  }
}
