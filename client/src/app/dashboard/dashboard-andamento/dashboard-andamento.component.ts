import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';
import { Graph } from 'src/interfaces/graph';
import { LookupInterface } from 'src/interfaces/lookup.interface';
import { VenditaAndamentoResponse } from 'src/models/vendita/vendita-andamento';
import { VenditaAnniResponse } from 'src/models/vendita/vendita-anni';
import { VenditaService } from 'src/services/vendita.service';
import { FormInputSelectComponent } from 'src/shared/form-input-select/form-input-select.component';

@Component({
  selector: 'dashboard-andamento',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    FormInputSelectComponent,
    ChartModule,
    SkeletonModule,
  ],
  providers: [
    VenditaService
  ],
  templateUrl: './dashboard-andamento.component.html',
  styleUrl: './dashboard-andamento.component.scss'
})
export class DashboardAndamentoComponent implements OnInit, OnDestroy {
  anni: LookupInterface[] = [];
  anno: number = 0;
  loading: boolean = false;
  graph: Graph = {};
  totaleVendite: number = 0;
  totaleSpese: number = 0;

  private anniSubscription?: Subscription;
  private andamentoSubscription?: Subscription;
  private loadingTimeout?: number;

  constructor(
    private venditaService: VenditaService
  ) {}

  ngOnInit(): void {
    this.preparaBox();
  }

  ngOnDestroy(): void {
    this.anniSubscription?.unsubscribe();
    this.andamentoSubscription?.unsubscribe();
    clearTimeout(this.loadingTimeout);
  }

  private preparaBox(): void {
    this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);

    this.anniSubscription = this.venditaService.getAnni().subscribe((res: VenditaAnniResponse) => {

      if (res.success) {
        this.anni = res.data;

        if (this.anni != null &&this.anni.length > 0) {
          this.anno = this.anni[0].id;

          this.preparaGrafico();
        } else {
          window.clearTimeout(this.loadingTimeout);
          this.loading = false;
        }
      }
    });
  }

  preparaGrafico(): void {
    if (this.loadingTimeout == null) {
      this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);
    }

    this.andamentoSubscription = this.venditaService.getAndamentoVendite(this.anno).subscribe({
      next: (response: VenditaAndamentoResponse) => {
        if (response.success) {
          this.graph = response.data;
          this.totaleVendite = response.totaleVendite;
          this.totaleSpese = response.totaleSpese;
        }

        window.clearTimeout(this.loadingTimeout);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading graph:', error);

        window.clearTimeout(this.loadingTimeout);
        this.loading = false;
      }
    });
  }
}
