import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { TableModule } from 'primeng/table';
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
export class StampanteListingComponent implements OnInit, OnDestroy {
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

  constructor(
    private stampanteService: StampanteService,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadStampanti();
  }

  ngOnDestroy(): void {
    this.stampantiSubscription?.unsubscribe();
    this.stampanteDeleteSubscription?.unsubscribe();
  }

  loadStampanti(): void {
    this.loading = true;
    
    this.stampantiSubscription = this.stampanteService.getListing(this.filtri)
      .subscribe({
        next: (response: StampanteListingResponse) => {
          this.stampanti = response.data;
          this.totalRecords = response.count;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading stampanti:', error);
          this.loading = false;
        }
      });
  }

  onSearchChange(): void {
    this.filtri.offset = 0;
    this.loadStampanti();
  }

  onPageChange(event: any): void {
    this.filtri.offset = event.first;
    this.filtri.limit = event.rows;
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
    this.loading = true;
    this.stampanteDeleteSubscription = this.stampanteService.delete(id)
      .subscribe({
        next: () => {
          this.loading = false;

          this.loadStampanti();
        },
        error: (error) => {
          console.error('Error deleting stampante:', error);
        }
      });
  }
}
