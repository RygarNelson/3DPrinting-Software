import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, FilterMetadata, MessageService } from 'primeng/api';
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
import { ClienteLookupDirective } from 'src/directives/cliente/cliente-lookup.directive';
import { VenditaDettaglioStatoStampaLookupDirective } from 'src/directives/vendita/vendita-dettaglio-stato-stampa-lookup.directive';
import { VenditaStatoSpedizioneLookupDirective } from 'src/directives/vendita/vendita-stato-spedizione-lookup.directive';
import { VenditaDettaglioStatoStampaEnum } from 'src/enums/VenditaDettaglioStatoStampaEnum';
import { VenditaListingDettaglioModel, VenditaListingModel, VenditaListingResponse } from 'src/models/vendita/vendita-listing';
import { VenditaListingFiltri } from 'src/models/vendita/vendita-listing-filtri';
import { VenditaService } from 'src/services/vendita.service';
import { DialogErrorComponent } from 'src/shared/dialog-error/dialog-error.component';
import { FormInputSelectComponent } from 'src/shared/form-input-select/form-input-select.component';
import { VenditaDettaglioStatoComponent } from '../vendita-dettaglio-stato/vendita-dettaglio-stato.component';
import { VenditaStatoComponent } from '../vendita-stato/vendita-stato.component';

@Component({
  selector: 'app-vendita-listing',
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
    VenditaStatoComponent,
    VenditaDettaglioStatoComponent,
    AccordionModule,
    FormInputSelectComponent,
    ClienteLookupDirective,
    VenditaStatoSpedizioneLookupDirective,
    VenditaDettaglioStatoStampaLookupDirective
  ],
  providers: [
    ConfirmationService,
    VenditaService
  ],
  templateUrl: './vendita-listing.component.html',
  styleUrl: './vendita-listing.component.scss'
})
export class VenditaListingComponent implements OnDestroy {
  // Data properties
  vendite: VenditaListingModel[] = [];
  totalRecords: number = 0;
  loading: boolean = false;
  expandedRows: any = {};

  // Filter properties
  filtri: VenditaListingFiltri = {
    offset: 0,
    limit: 10,
    search: ''
  };

  private venditeSubscription?: Subscription;
  private venditaDeleteSubscription?: Subscription;
  private loadingTimeout?: number;

  protected readonly VenditaDettaglioStatoStampaEnum = VenditaDettaglioStatoStampaEnum;

  constructor(
    private venditaService: VenditaService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {}

  ngOnDestroy(): void {
    this.venditeSubscription?.unsubscribe();
    this.venditaDeleteSubscription?.unsubscribe();
    clearTimeout(this.loadingTimeout);
  }

  loadVendite(): void {
    if (this.loadingTimeout == null) {
      this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);
    }
    
    this.venditeSubscription = this.venditaService.getListing(this.filtri)
      .subscribe({
        next: (response: VenditaListingResponse) => {
          this.vendite = response.data;
          this.totalRecords = response.count;

          window.clearTimeout(this.loadingTimeout);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading vendite:', error);

          window.clearTimeout(this.loadingTimeout);
          this.loading = false;

          this.dialogService.open(DialogErrorComponent, {
            inputValues: {
              error: error
            },
            modal: true
          });
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

    // Date filters
    const dataVenditaFilter: FilterMetadata | FilterMetadata[] | undefined = event.filters?.['data_vendita'];
    if (dataVenditaFilter) {
      let value = null;
      let operator = null;

      if (dataVenditaFilter instanceof Array) {
        value = dataVenditaFilter[0].value;
        operator = dataVenditaFilter[0].matchMode;
      } else {
        value = dataVenditaFilter.value;
        operator = dataVenditaFilter.matchMode;
      }

      if (value && operator) {
        this.filtri.data_vendita = {
          value: value,
          operator: operator
        };
      } else {
        this.filtri.data_vendita = undefined;
      }
    }
    else {
      this.filtri.data_vendita = undefined;
    }

    const dataScadenzaFilter: FilterMetadata | FilterMetadata[] | undefined = event.filters?.['data_scadenza'];
    if (dataScadenzaFilter) {
      let value = null;
      let operator = null;

      if (dataScadenzaFilter instanceof Array) {
        value = dataScadenzaFilter[0].value;
        operator = dataScadenzaFilter[0].matchMode;
      } else {
        value = dataScadenzaFilter.value;
        operator = dataScadenzaFilter.matchMode;
      }

      if (value && operator) {
        this.filtri.data_scadenza = {
          value: value,
          operator: operator
        };
      } else {
        this.filtri.data_scadenza = undefined;
      }
    }
    else {
      this.filtri.data_scadenza = undefined;
    }

    const totaleVenditaFilter: FilterMetadata | FilterMetadata[] | undefined = event.filters?.['totale_vendita'];
    if (totaleVenditaFilter) {
      let value = null;
      let operator = null;

      if (totaleVenditaFilter instanceof Array) {
        value = totaleVenditaFilter[0].value;
        operator = totaleVenditaFilter[0].matchMode;
      } else {
        value = totaleVenditaFilter.value;
        operator = totaleVenditaFilter.matchMode;
      }

      if (value && operator) {
        this.filtri.totale_vendita = {
          value: value,
          operator: operator
        };
      } else {
        this.filtri.totale_vendita = undefined;
      }
    }
    else {
      this.filtri.totale_vendita = undefined;
    }

    this.loadVendite();
  }

  refreshTable(): void {
    this.loadVendite();
  }

  addNewVendita(): void {
    this.router.navigate(['/vendita/manager']);
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
      globalFilter: '',
      sortField: '',
      sortOrder: 0
    });
  }

  editVendita(vendita: VenditaListingModel): void {
    this.router.navigate(['/vendita/manager', vendita.id]);
  }

  confirmDelete(event: Event, vendita: VenditaListingModel): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Sei sicuro di voler eliminare la vendita nr."${vendita.id}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      acceptIcon: 'pi pi-exclamation-triangle',
      rejectIcon: 'pi pi-times',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.deleteVendita(vendita.id);
      },
      reject: () => {
        // User rejected the deletion
      }
    });
  }

  private deleteVendita(id: number): void {
    this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);

    this.venditaDeleteSubscription = this.venditaService.delete(id)
      .subscribe({
        next: () => {
          window.clearTimeout(this.loadingTimeout);
          this.loading = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Vendita cancellata con successo'
          });

          this.loadVendite();
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
          
          console.error('Error deleting vendita:', error);
        }
      });
  }

  modificaStatoVendita(vendita: VenditaListingModel): void {
    this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);

    this.venditaService.modificaStatoVendita(vendita.id, vendita.stato_spedizione)
      .subscribe({
        next: () => {
          window.clearTimeout(this.loadingTimeout);
          this.loading = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Stato spedizione modificato con successo'
          });

          this.loadVendite();
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

          console.error('Error avanzando stato dettaglio:', error);
        }
      });
  }

  modificaStatoDettaglio(dettaglio: VenditaListingDettaglioModel): void {
    this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);

    this.venditaService.modificaStatoDettaglio(dettaglio.id, dettaglio.stato_stampa)
      .subscribe({
        next: () => {
          window.clearTimeout(this.loadingTimeout);
          this.loading = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Stato di stampa modificato con successo'
          });

          this.loadVendite();
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

          console.error('Error avanzando stato dettaglio:', error);
        }
      });
  }
}