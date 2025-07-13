import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';
import { VenditaContoBancarioModel } from 'src/models/vendita/vendita-conti-bancari';
import { VenditaService } from 'src/services/vendita.service';

@Component({
  selector: 'dashboard-conti-bancari',
  imports: [
    CommonModule,
    CardModule,
    SkeletonModule
  ],
  providers: [
    VenditaService
  ],
  templateUrl: './dashboard-conti-bancari.component.html',
  styleUrl: './dashboard-conti-bancari.component.scss'
})
export class DashboardContiBancariComponent implements OnInit, OnDestroy, OnChanges {

  @Input() anno?: number = 0;

  loading: boolean = false;
  contiBancari: VenditaContoBancarioModel[] = [];

  private contiBancariSubscription?: Subscription;
  private loadingTimeout?: number;

  constructor(
    private venditaService: VenditaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.anno != null && this.anno != 0) {
      this.getStatoContiBancari();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.anno != null && this.anno != 0) {
      this.getStatoContiBancari();
    }
  }

  ngOnDestroy(): void {
    this.contiBancariSubscription?.unsubscribe();
    clearTimeout(this.loadingTimeout);
    this.loadingTimeout = undefined;
  }

  getStatoContiBancari(): void {
    this.loading = true;
    this.contiBancariSubscription = this.venditaService.getStatoContiBancari(this.anno!).subscribe({
      next: (response) => {
        console.log(response);
        this.contiBancari = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      }
    });
  }

  goToVenditaListing(contoBancarioId: number): void {
    this.router.navigate(['/vendita', 'listing'], { queryParams: { conto_bancario_id: contoBancarioId } });
  }
}
