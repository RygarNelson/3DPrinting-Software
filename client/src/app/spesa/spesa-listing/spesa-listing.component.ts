import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, FilterMetadata, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { DrawerModule } from 'primeng/drawer';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { SkeletonModule } from 'primeng/skeleton';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';
import { SpesaTipoLookupDirective } from 'src/directives/spesa/spesa-tipo-lookup.directive';
import { SpesaUnitaMisuraLookupDirective } from 'src/directives/spesa/spesa-unita-misura-lookup.directive';
import { SpesaListingModel, SpesaListingResponse } from 'src/models/spesa/spesa-listing';
import { SpesaListingFiltri } from 'src/models/spesa/spesa-listing-filtri';
import { ApplicationStateService } from 'src/services/application-state.service';
import { SpesaService } from 'src/services/spesa.service';
import { AuditLogComponent } from 'src/shared/audit-log/audit-log.component';
import { DialogErrorComponent } from 'src/shared/dialog-error/dialog-error.component';
import { FormInputSelectComponent } from 'src/shared/form-input-select/form-input-select.component';
import { SpesaTipoPipe } from '../spesa-tipo.pipe';
import { SpesaUnitaMisuraPipe } from '../spesa-unita-misura.pipe';

@Component({
  selector: 'app-spesa-listing',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    SkeletonModule,
    TooltipModule,
    DrawerModule,
    DatePickerModule,
    MenuModule,
    CheckboxModule,
    SpesaTipoPipe,
    SpesaUnitaMisuraPipe,
    SpesaTipoLookupDirective,
    SpesaUnitaMisuraLookupDirective,
    FormInputSelectComponent
  ],
  providers: [SpesaService],
  templateUrl: './spesa-listing.component.html',
  styleUrl: './spesa-listing.component.scss'
})
export class SpesaListingComponent {
  // Data properties
  spese: SpesaListingModel[] = [];
  totalRecords: number = 0;
  loading: boolean = false;

  // Filter properties
  filtri: SpesaListingFiltri = {
    offset: 0,
    limit: 100,
    search: '',
    data_spesa: { value: undefined, operator: 'dateIs' },
    totale_spesa: { value: undefined, operator: 'equals' },
    quantita: { value: undefined, operator: 'equals' }
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

  private speseSubscription?: Subscription;
  private spesaDeleteSubscription?: Subscription;
  private loadingTimeout?: number;

  constructor(
    private spesaService: SpesaService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService,
    public applicationState: ApplicationStateService
  ) {}

  ngOnDestroy(): void {
    this.speseSubscription?.unsubscribe();
    this.spesaDeleteSubscription?.unsubscribe();
    clearTimeout(this.loadingTimeout);
  }

  loadSpese(): void {
    this.loading = true;

    this.speseSubscription = this.spesaService.getListing(this.filtri).subscribe({
      next: (response: SpesaListingResponse) => {
        this.spese = response.data;
        this.totalRecords = response.count;

        window.clearTimeout(this.loadingTimeout);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading spese:', error);

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

    const dataSpesaFilter: FilterMetadata | FilterMetadata[] | undefined = event.filters?.['data_spesa'];
    if (dataSpesaFilter) {
      let value = null;
      let operator = null;

      if (dataSpesaFilter instanceof Array) {
        value = dataSpesaFilter[0].value;
        operator = dataSpesaFilter[0].matchMode;
      } else {
        value = dataSpesaFilter.value;
        operator = dataSpesaFilter.matchMode;
      }

      if (value && operator) {
        this.filtri.data_spesa = {
          value: value,
          operator: operator
        };
      } else {
        this.filtri.data_spesa = { value: undefined, operator: 'dateIs' };
      }
    } else {
      this.filtri.data_spesa = { value: undefined, operator: 'dateIs' };
    }

    const totaleSpesaFilter: FilterMetadata | FilterMetadata[] | undefined = event.filters?.['totale_spesa'];
    if (totaleSpesaFilter) {
      let value = null;
      let operator = null;

      if (totaleSpesaFilter instanceof Array) {
        value = totaleSpesaFilter[0].value;
        operator = totaleSpesaFilter[0].matchMode;
      } else {
        value = totaleSpesaFilter.value;
        operator = totaleSpesaFilter.matchMode;
      }

      if (value && operator) {
        this.filtri.totale_spesa = {
          value: value,
          operator: operator
        };
      } else {
        this.filtri.totale_spesa = { value: undefined, operator: 'equals' };
      }
    } else {
      this.filtri.totale_spesa = { value: undefined, operator: 'equals' };
    }

    const quantitaFilter: FilterMetadata | FilterMetadata[] | undefined = event.filters?.['quantita'];
    if (quantitaFilter) {
      let value = null;
      let operator = null;

      if (quantitaFilter instanceof Array) {
        value = quantitaFilter[0].value;
        operator = quantitaFilter[0].matchMode;
      } else {
        value = quantitaFilter.value;
        operator = quantitaFilter.matchMode;
      }

      if (value && operator) {
        this.filtri.quantita = {
          value: value,
          operator: operator
        };
      } else {
        this.filtri.quantita = { value: undefined, operator: 'equals' };
      }
    } else {
      this.filtri.quantita = { value: undefined, operator: 'equals' };
    }

    this.loadSpese();
  }

  pulisciFiltri(): void {
    this.filtri = {
      offset: 0,
      limit: 100,
      search: '',
      data_spesa: { value: undefined, operator: 'dateIs' },
      totale_spesa: { value: undefined, operator: 'equals' },
      quantita: { value: undefined, operator: 'equals' }
    };

    this.loadData({
      first: 0,
      rows: 100,
      globalFilter: '',
      sortField: 'data_spesa',
      sortOrder: -1
    });
  }

  refreshTable(): void {
    this.loadSpese();
  }

  addNewSpesa(): void {
    this.router.navigate(['/spesa/manager']);
  }

  editSpesa(spesa: SpesaListingModel): void {
    this.router.navigate(['/spesa/manager', spesa.id]);
  }

  viewAuditLog(spesa: SpesaListingModel): void {
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
        tableName: 'T_SPESE',
        recordId: spesa.id,
        objectName: `Spesa ${spesa.id.toString()}`
      }
    };
    this.dialogService.open(AuditLogComponent, config);
  }

  confirmDelete(event: Event, spesa: SpesaListingModel): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Sei sicuro di voler eliminare la spesa?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      acceptIcon: 'pi pi-exclamation-triangle',
      rejectIcon: 'pi pi-times',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.deleteSpesa(spesa.id);
      },
      reject: () => {
        // User rejected the deletion
      }
    });
  }

  private deleteSpesa(id: number): void {
    this.loading = true;

    this.spesaDeleteSubscription = this.spesaService.delete(id).subscribe({
      next: () => {
        window.clearTimeout(this.loadingTimeout);
        this.loading = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Spesa cancellata con successo'
        });

        this.loadSpese();
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

        console.error('Error deleting spesa:', error);
      }
    });
  }

  toggleSidebarFilters(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  applicaSidebarFiltri(): void {
    this.sidebarVisible = false;
    this.loadSpese();
  }

  resetSidebarFiltri(): void {
    this.pulisciFiltri();
    this.sidebarVisible = false;
  }
}
