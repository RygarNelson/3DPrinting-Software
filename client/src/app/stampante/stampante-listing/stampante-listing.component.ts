import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
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
    InputIconModule
  ],
  templateUrl: './stampante-listing.component.html',
  styleUrl: './stampante-listing.component.scss',
  providers: [
    ConfirmationService,
    StampanteService
  ]
})
export class StampanteListingComponent implements OnInit {
  @ViewChild('searchInput') searchInput: any;

  // Data properties
  stampanti: StampanteListingModel[] = [];
  totalRecords: number = 0;
  loading: boolean = false;

  // Filter properties
  filtri: StampanteListingFiltri = new StampanteListingFiltri();
  searchTerm: string = '';

  // Pagination
  first: number = 0;
  rows: number = 10;

  // Search debounce
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private stampanteService: StampanteService,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {
    // Setup search debounce
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.filtri.search = searchTerm;
        this.filtri.offset = 0;
        this.first = 0;
        this.loadStampanti();
      });
  }

  ngOnInit(): void {
    this.loadStampanti();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load stampanti with current filters
   */
  loadStampanti(): void {
    this.loading = true;
    
    this.stampanteService.getListing(this.filtri)
      .pipe(takeUntil(this.destroy$))
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

  /**
   * Handle search input changes
   */
  onSearchChange(event: any): void {
    this.searchSubject.next(event.target.value);
  }

  /**
   * Handle table pagination
   */
  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.filtri.offset = event.first;
    this.filtri.limit = event.rows;
    this.loadStampanti();
  }

  /**
   * Refresh the table data
   */
  refreshTable(): void {
    this.loadStampanti();
  }

  /**
   * Navigate to add new stampante
   */
  addNewStampante(): void {
    this.router.navigate(['/stampante/manager']);
  }

  /**
   * Navigate to edit stampante
   */
  editStampante(stampante: StampanteListingModel): void {
    this.router.navigate(['/stampante/manager', stampante.id]);
  }

  /**
   * Show delete confirmation popup
   */
  confirmDelete(event: Event, stampante: StampanteListingModel): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Sei sicuro di voler eliminare la stampante "${stampante.nome}"?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteStampante(stampante.id);
      },
      reject: () => {
        // User rejected the deletion
      }
    });
  }

  /**
   * Delete stampante
   */
  private deleteStampante(id: number): void {
    this.stampanteService.delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Reload the table after successful deletion
          this.loadStampanti();
        },
        error: (error) => {
          console.error('Error deleting stampante:', error);
        }
      });
  }
}
