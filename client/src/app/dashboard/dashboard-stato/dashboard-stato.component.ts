import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';
import { VenditaDettaglioStatoStampaEnum } from 'src/enums/VenditaDettaglioStatoStampaEnum';
import { VenditaStatoSpedizioneEnum } from 'src/enums/VenditaStatoSpedizioneEnum';
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

  protected readonly VenditaDettaglioStatoStampaEnum = VenditaDettaglioStatoStampaEnum;
  protected readonly VenditaStatoSpedizioneEnum = VenditaStatoSpedizioneEnum;

  private statoSubscription?: Subscription;
  private loadingTimeout?: number;

  constructor(
    private venditaService: VenditaService,
    private router: Router
  ) {}

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

  goToVenditeStatoSpedizione(stato: VenditaStatoSpedizioneEnum): void {
    this.router.navigate(['/vendita', 'listing'], {
      queryParams: {
        stato_spedizione: stato,
      }
    });
  }

  goToVenditeStatoStampa(stato: VenditaDettaglioStatoStampaEnum): void {
    this.router.navigate(['/vendita', 'listing'], {
      queryParams: {
        stato_stampa: stato,
      }
    });
  }

  goToVenditeInScadenza(): void {
    this.router.navigate(['/vendita', 'listing'], {
      queryParams: {
        isInScadenza: true,
      }
    });
  }

  goToVenditeScadute(): void {
    this.router.navigate(['/vendita', 'listing'], {
      queryParams: {
        isScaduto: true,
      }
    });
  }
}
