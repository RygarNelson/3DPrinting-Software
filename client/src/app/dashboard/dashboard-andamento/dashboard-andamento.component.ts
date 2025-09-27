import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';
import { Graph } from 'src/interfaces/graph';
import { VenditaAndamentoResponse } from 'src/models/vendita/vendita-andamento';
import { ApplicationStateService } from 'src/services/application-state.service';
import { VenditaService } from 'src/services/vendita.service';

@Component({
  selector: 'dashboard-andamento',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ChartModule,
    SkeletonModule,
  ],
  providers: [
    VenditaService
  ],
  templateUrl: './dashboard-andamento.component.html',
  styleUrl: './dashboard-andamento.component.scss'
})
export class DashboardAndamentoComponent implements OnInit, OnDestroy, OnChanges {
  
  @Input() anno: number = 0;

  loading: boolean = false;
  graph: Graph = {};
  totaleVendite: number = 0;
  totaleSpese: number = 0;
  totaleSospese: number = 0;

  private andamentoSubscription?: Subscription;
  private loadingTimeout?: number;

  constructor(
    private venditaService: VenditaService,
    public applicationState: ApplicationStateService
  ) {}

  ngOnInit(): void {
    if (this.anno != null && this.anno != 0) {
      this.preparaGrafico();
    }
  }

  ngOnDestroy(): void {
    this.andamentoSubscription?.unsubscribe();
    clearTimeout(this.loadingTimeout);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.preparaGrafico();
  }

  preparaGrafico(): void {

    if (this.anno != null && this.anno != 0) {
      if (this.loadingTimeout == null) {
        this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);
      }
  
      this.andamentoSubscription = this.venditaService.getAndamentoVendite(this.anno).subscribe({
        next: (response: VenditaAndamentoResponse) => {
          if (response.success) {
            this.graph = response.data;
            this.totaleVendite = response.totaleVendite;
            this.totaleSpese = response.totaleSpese;
            this.totaleSospese = response.totaleSospese;
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
}
