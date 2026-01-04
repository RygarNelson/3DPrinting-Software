import { CommonModule } from '@angular/common';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { SkeletonModule } from 'primeng/skeleton';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';
import { ApplicationStateService } from 'src/services/application-state.service';
import { AuditLogComponent } from 'src/shared/audit-log/audit-log.component';
import { DialogErrorComponent } from 'src/shared/dialog-error/dialog-error.component';
import { MobileCardItemComponent } from 'src/shared/mobile-card-item/mobile-card-item.component';
import { StampanteListingModel, StampanteListingResponse } from '../../../models/stampante/stampante-listing';
import { StampanteListingFiltri } from '../../../models/stampante/stampante-listing-filtri';
import { StampanteService } from '../../../services/stampante.service';
import { StampanteListingEliminaMessaggioPipe } from '../pipes/stampante-listing-elimina-messaggio.pipe';

@Component({
  selector: 'app-stampante-listing',
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, TableModule, InputTextModule, IconFieldModule, InputIconModule, SkeletonModule, TooltipModule, StampanteListingEliminaMessaggioPipe, MenuModule, MobileCardItemComponent],
  templateUrl: './stampante-listing.component.html',
  styleUrl: './stampante-listing.component.scss',
  providers: [StampanteService]
})
export class StampanteListingComponent implements OnDestroy {
  // Data properties
  stampanti: StampanteListingModel[] = [];
  totalRecords: number = 0;
  loading: boolean = false;

  // Filter properties
  filtri: StampanteListingFiltri = {
    offset: 0,
    limit: 100,
    search: ''
  };
  sidebarVisible: boolean = false;
  multipleAzioni: MenuItem[] = [
    {
      label: 'Sincronizza / Aggiorna',
      icon: 'pi pi-refresh',
      command: () => {
        this.refreshTable();
      }
    },
    {
      label: 'Pulisci filtri',
      icon: 'pi pi-filter-slash',
      command: () => {
        this.dataTable?.clear();
        this.pulisciFiltri();
      }
    }
  ];

  @ViewChild('dataTable') dataTable?: Table;

  private stampantiSubscription?: Subscription;
  private stampanteDeleteSubscription?: Subscription;
  private loadingTimeout?: number;

  constructor(
    private stampanteService: StampanteService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService,
    public applicationState: ApplicationStateService
  ) {}

  ngOnDestroy(): void {
    this.stampantiSubscription?.unsubscribe();
    this.stampanteDeleteSubscription?.unsubscribe();
    clearTimeout(this.loadingTimeout);
  }

  loadStampanti(): void {
    this.loading = true;

    this.stampantiSubscription = this.stampanteService.getListing(this.filtri).subscribe({
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
    this.filtri.limit = event.rows ?? 100;

    // Global filter
    if (event.globalFilter) {
      this.filtri.search = typeof event.globalFilter === 'string' ? event.globalFilter : event.globalFilter[0];
    } else {
      this.filtri.search = undefined;
    }

    // Sorting
    if (event.sortField) {
      this.filtri.order = {
        column: typeof event.sortField === 'string' ? event.sortField : event.sortField[0],
        direction: event.sortOrder === 1 ? 'ASC' : 'DESC'
      };
    } else {
      this.filtri.order = undefined;
    }

    this.loadStampanti();
  }

  pulisciFiltri(): void {
    this.filtri = {
      offset: 0,
      limit: 100,
      search: ''
    };

    this.loadData({
      first: 0,
      rows: 100,
      globalFilter: ''
    });
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

  viewAuditLog(stampante: StampanteListingModel): void {
    let config: DynamicDialogConfig = {
      width: '90%',
      height: '80%',
      modal: true,
      dismissableMask: true,
      closable: true,
      showHeader: false,
      contentStyle: {
        height: '100%',
        width: '100%',
        padding: '0px'
      },
      data: {
        tableName: 'T_STAMPANTI',
        recordId: stampante.id,
        objectName: `Stampante ${stampante.nome} (${stampante.id})`
      }
    };
    this.dialogService.open(AuditLogComponent, config);
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

    this.stampanteDeleteSubscription = this.stampanteService.delete(id).subscribe({
      next: () => {
        window.clearTimeout(this.loadingTimeout);
        this.loading = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Stampante cancellata con successo'
        });

        this.loadStampanti();
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

        console.error('Error deleting stampante:', error);
      }
    });
  }
}
