import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogService } from 'primeng/dynamicdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';
import { ContoBancarioListingModel, ContoBancarioListingResponse } from 'src/models/conto-bancario/conto-bancario-listing';
import { ContoBancarioListingFiltri } from 'src/models/conto-bancario/conto-bancario-listing-filtri';
import { ContoBancarioService } from 'src/services/conto-bancario.service';
import { DialogErrorComponent } from 'src/shared/dialog-error/dialog-error.component';
import { ContoBancarioListingEliminaMessaggioPipe } from '../pipes/conto-bancario-listing-elimina-messaggio.pipe';

@Component({
  selector: 'app-conto-bancario-listing',
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
    SkeletonModule,
    TooltipModule,
    ContoBancarioListingEliminaMessaggioPipe
  ],
  providers: [
    ConfirmationService,
    ContoBancarioService
  ],
  templateUrl: './conto-bancario-listing.component.html',
  styleUrl: './conto-bancario-listing.component.scss'
})
export class ContoBancarioListingComponent {
  // Data properties
  conti_bancari: ContoBancarioListingModel[] = [];
  totalRecords: number = 0;
  loading: boolean = false;

  // Filter properties
  filtri: ContoBancarioListingFiltri = {
    offset: 0,
    limit: 10,
    search: ''
  };

  private contoBancarioSubscription?: Subscription;
  private contoBancarioDeleteSubscription?: Subscription;
  private loadingTimeout?: number;

  constructor(
    private contoBancarioService: ContoBancarioService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) { }

  ngOnDestroy(): void {
    this.contoBancarioSubscription?.unsubscribe();
    this.contoBancarioDeleteSubscription?.unsubscribe();

    clearTimeout(this.loadingTimeout);
    this.loadingTimeout = undefined;
  }

  loadModelli(): void {
    if (this.loadingTimeout == null) {
      this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);
    }

    this.contoBancarioSubscription = this.contoBancarioService.getListing(this.filtri)
      .subscribe({
        next: (response: ContoBancarioListingResponse) => {
          this.conti_bancari = response.data;
          this.totalRecords = response.count;

          clearTimeout(this.loadingTimeout);
          this.loadingTimeout = undefined;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading stampanti:', error);

          clearTimeout(this.loadingTimeout);
          this.loadingTimeout = undefined;
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

    this.loadModelli();
  }

  pulisciFiltri(): void {
    this.filtri = {
      offset: 0,
      limit: 10,
      search: ''
    };

    this.loadData({
      first: 0,
      rows: 10,
      globalFilter: ''
    });
  }

  refreshTable(): void {
    this.loadModelli();
  }

  addNewContoBancario(): void {
    this.router.navigate(['/conto-bancario/manager']);
  }

  editContoBancario(contoBancario: ContoBancarioListingModel): void {
    this.router.navigate(['/conto-bancario/manager', contoBancario.id]);
  }

  confirmDelete(event: Event, contoBancario: ContoBancarioListingModel): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Sei sicuro di voler eliminare il conto bancario "${contoBancario.iban}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      acceptIcon: 'pi pi-exclamation-triangle',
      rejectIcon: 'pi pi-times',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.deleteContoBancario(contoBancario.id);
      },
      reject: () => {
        // User rejected the deletion
      }
    });
  }

  private deleteContoBancario(id: number): void {
    this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);

    this.contoBancarioDeleteSubscription = this.contoBancarioService.delete(id)
      .subscribe({
        next: () => {
          clearTimeout(this.loadingTimeout);
          this.loadingTimeout = undefined;
          this.loading = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Conto bancario cancellato con successo'
          });

          this.loadModelli();
        },
        error: (error) => {
          clearTimeout(this.loadingTimeout);
          this.loadingTimeout = undefined;
          this.loading = false;

          this.dialogService.open(DialogErrorComponent, {
            inputValues: {
              error: error
            },
            modal: true
          });

          console.error('Error deleting conto bancario:', error);
        }
      });
  }
}
