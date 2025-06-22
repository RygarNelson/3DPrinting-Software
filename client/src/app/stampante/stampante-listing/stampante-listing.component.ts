import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { StampanteListingModel, StampanteListingResponse } from '../../../models/stampante/stampante-listing';
import { StampanteListingFiltri } from '../../../models/stampante/stampante-listing-filtri';
import { StampanteService } from '../../../services/stampante.service';

@Component({
  selector: 'app-stampante-listing',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    ConfirmPopupModule,
    IconFieldModule,
    InputIconModule,
    SkeletonModule
  ],
  templateUrl: './stampante-listing.component.html',
  styleUrl: './stampante-listing.component.scss',
  providers: [
    ConfirmationService,
    StampanteService
  ]
})
export class StampanteListingComponent implements OnDestroy {
  // Data properties
  stampanti: StampanteListingModel[] = [];
  totalRecords: number = 0;
  loading: boolean = false;

  // Filter properties
  filtri: StampanteListingFiltri = {
    offset: 0,
    limit: 10,
    search: ''
  };

  private stampantiSubscription?: Subscription;
  private stampanteDeleteSubscription?: Subscription;
  private loadingTimeout?: number;

  constructor(
    private stampanteService: StampanteService,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {}

  ngOnDestroy(): void {
    this.stampantiSubscription?.unsubscribe();
    this.stampanteDeleteSubscription?.unsubscribe();
    clearTimeout(this.loadingTimeout);
  }

  loadStampanti(): void {
    this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);
    
    this.stampantiSubscription = this.stampanteService.getListing(this.filtri)
      .subscribe({
        next: (response: StampanteListingResponse) => {
          this.stampanti = response.data;
          this.totalRecords = response.count;

          window.clearTimeout(this.loadingTimeout);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading stampanti:', error);

          window.clearTimeout(this.loadingTimeout);
          this.loading = false;
        }
      });
  }

  loadData(event: TableLazyLoadEvent): void {
    this.filtri.offset = event.first;
    this.filtri.limit = event.rows ?? 10;

    // Global filter
    if (event.globalFilter) {
      this.filtri.search = typeof event.globalFilter === 'string' ? event.globalFilter : event.globalFilter[0];
    }
    else {
      this.filtri.search = undefined;
    }

    // Sorting
    if (event.sortField) {
      this.filtri.order = {
        column: typeof event.sortField === 'string' ? event.sortField : event.sortField[0],
        direction: event.sortOrder === 1 ? 'ASC' : 'DESC'
      }
    }
    else {
      this.filtri.order = undefined;
    }

    this.loadStampanti();
  }

  refreshTable(): void {
    this.loadStampanti();
  }

  addNewStampante(): void {
    this.router.navigate(['/stampante/manager']);
  }

  editStampante(stampante: StampanteListingModel): void {
    this.router.navigate(['/stampante/manager', stampante.id]);
  }

  confirmDelete(event: Event, stampante: StampanteListingModel): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Sei sicuro di voler eliminare la stampante "${stampante.nome}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      acceptIcon: 'pi pi-exclamation-triangle',
      rejectIcon: 'pi pi-times',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.deleteStampante(stampante.id);
      },
      reject: () => {
        // User rejected the deletion
      }
    });
  }

  private deleteStampante(id: number): void {
    this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);

    this.stampanteDeleteSubscription = this.stampanteService.delete(id)
      .subscribe({
        next: () => {
          window.clearTimeout(this.loadingTimeout);
          this.loading = false;

          this.loadStampanti();
        },
        error: (error) => {
          window.clearTimeout(this.loadingTimeout);
          this.loading = false;
          
          console.error('Error deleting stampante:', error);
        }
      });
  }
}
