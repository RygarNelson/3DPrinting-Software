import { ModelloTipoComponent } from '@/modello/modello-tipo/modello-tipo.component';
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { VenditaRiepilogoModelli } from 'src/models/vendita/vendita-riepilogo-modelli';
import { VenditaService } from 'src/services/vendita.service';

@Component({
  selector: 'dashboard-riepilogo-modelli',
  imports: [
    CommonModule,
    CardModule,
    SkeletonModule,
    TableModule,
    ModelloTipoComponent,
    ButtonModule
  ],
  providers: [
    VenditaService
  ],
  templateUrl: './dashboard-riepilogo-modelli.component.html',
  styleUrl: './dashboard-riepilogo-modelli.component.scss'
})
export class DashboardRiepilogoModelliComponent implements OnInit, OnDestroy, OnChanges {

  @Input() anno?: number = 0;

  loading: boolean = false;
  riepilogo: VenditaRiepilogoModelli[] = [];  

  private riepilogoSubscription?: Subscription;
  private loadingTimeout?: number;

  constructor(
    private venditaService: VenditaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.anno != null && this.anno != 0) {
      this.getRiepilogo();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.anno != null && this.anno != 0) {
      this.getRiepilogo();
    }
  }

  ngOnDestroy(): void {
    this.riepilogoSubscription?.unsubscribe();
    clearTimeout(this.loadingTimeout);
    this.loadingTimeout = undefined;
  }

  getRiepilogo(): void {
    if (this.loadingTimeout == null) {
      this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);
    }
    this.riepilogoSubscription = this.venditaService.getRiepilogoModelli(this.anno!).subscribe({
      next: (response) => {
        this.riepilogo = response.data;

        window.clearTimeout(this.loadingTimeout);
        this.loadingTimeout = undefined;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);

        window.clearTimeout(this.loadingTimeout);
        this.loadingTimeout = undefined;
        this.loading = false;
      }
    });
  }
}
