import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
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
import { DialogErrorComponent } from 'src/shared/dialog-error/dialog-error.component';
import { ClienteListingModel, ClienteListingResponse } from '../../../models/cliente/cliente-listing';
import { ClienteListingFiltri } from '../../../models/cliente/cliente-listing-filtri';
import { ClienteService } from '../../../services/cliente.service';
import { ClienteListingEliminaMessaggioPipe } from '../pipes/cliente-listing-elimina-messaggio.pipe';

@Component({
  selector: 'app-cliente-listing',
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
    ClienteListingEliminaMessaggioPipe
  ],
  templateUrl: './cliente-listing.component.html',
  providers: [
    ConfirmationService,
    ClienteService
  ]
})
export class ClienteListingComponent implements OnDestroy {
  clienti: ClienteListingModel[] = [];
  totalRecords: number = 0;
  loading: boolean = false;

  filtri: ClienteListingFiltri = {
    offset: 0,
    limit: 10,
    search: ''
  };

  private clientiSubscription?: Subscription;
  private clienteDeleteSubscription?: Subscription;
  private loadingTimeout?: number;

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {}

  ngOnDestroy(): void {
    this.clientiSubscription?.unsubscribe();
    this.clienteDeleteSubscription?.unsubscribe();
    clearTimeout(this.loadingTimeout);
  }

  loadClienti(): void {
    this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);
    
    this.clientiSubscription = this.clienteService.getListing(this.filtri)
      .subscribe({
        next: (response: ClienteListingResponse) => {
          this.clienti = response.data;
          this.totalRecords = response.count;

          window.clearTimeout(this.loadingTimeout);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading clienti:', error);

          window.clearTimeout(this.loadingTimeout);
          this.loading = false;
        }
      });
  }

  loadData(event: TableLazyLoadEvent): void {
    this.filtri.offset = event.first;
    this.filtri.limit = event.rows ?? 10;

    if (event.globalFilter) {
      this.filtri.search = typeof event.globalFilter === 'string' ? event.globalFilter : event.globalFilter[0];
    }
    else {
      this.filtri.search = undefined;
    }

    if (event.sortField) {
      this.filtri.order = {
        column: typeof event.sortField === 'string' ? event.sortField : event.sortField[0],
        direction: event.sortOrder === 1 ? 'ASC' : 'DESC'
      }
    }
    else {
      this.filtri.order = undefined;
    }

    this.loadClienti();
  }

  refreshTable(): void {
    this.loadClienti();
  }

  addNewCliente(): void {
    this.router.navigate(['/cliente/manager']);
  }

  editCliente(cliente: ClienteListingModel): void {
    this.router.navigate(['/cliente/manager', cliente.id]);
  }

  confirmDelete(event: Event, cliente: ClienteListingModel): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Sei sicuro di voler eliminare il cliente "${cliente.etichetta}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      acceptIcon: 'pi pi-exclamation-triangle',
      rejectIcon: 'pi pi-times',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.deleteCliente(cliente.id);
      },
      reject: () => {
        // User rejected the deletion
      }
    });
  }

  private deleteCliente(id: number): void {
    this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);

    this.clienteDeleteSubscription = this.clienteService.delete(id)
      .subscribe({
        next: () => {
          window.clearTimeout(this.loadingTimeout);
          this.loading = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Cliente cancellato con successo'
          });

          this.loadClienti();
        },
        error: (error) => {
          window.clearTimeout(this.loadingTimeout);
          this.loading = false;

          this.dialogService.open(DialogErrorComponent, {
            inputValues: {
              error: error
            },
            modal: true
          });
          
          console.error('Error deleting cliente:', error);
        }
      });
  }
} 