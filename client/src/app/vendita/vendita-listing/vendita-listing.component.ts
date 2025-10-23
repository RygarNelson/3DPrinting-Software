import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, FilterMetadata, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { SkeletonModule } from 'primeng/skeleton';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';
import { ClienteLookupDirective } from 'src/directives/cliente/cliente-lookup.directive';
import { ContoBancarioLookupDirective } from 'src/directives/conto-bancario/conto-bancario-lookup.directive';
import { VenditaDettaglioStatoStampaLookupDirective } from 'src/directives/vendita/vendita-dettaglio-stato-stampa-lookup.directive';
import { VenditaStatoSpedizioneLookupDirective } from 'src/directives/vendita/vendita-stato-spedizione-lookup.directive';
import { VenditaDettaglioStatoStampaEnum } from 'src/enums/VenditaDettaglioStatoStampaEnum';
import { VenditaListingDettaglioBasettaModel, VenditaListingDettaglioModel, VenditaListingModel, VenditaListingResponse } from 'src/models/vendita/vendita-listing';
import { VenditaListingFiltri } from 'src/models/vendita/vendita-listing-filtri';
import { VenditaModificaContoBancarioModel } from 'src/models/vendita/vendita_modifica_conto_bancario';
import { ApplicationStateService } from 'src/services/application-state.service';
import { VenditaService } from 'src/services/vendita.service';
import { AuditLogComponent } from 'src/shared/audit-log/audit-log.component';
import { DialogErrorComponent } from 'src/shared/dialog-error/dialog-error.component';
import { FormInputRadiobuttonComponent } from 'src/shared/form-input-radiobutton/form-input-radiobutton.component';
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
    IconFieldModule,
    InputIconModule,
    SkeletonModule,
    TooltipModule,
    VenditaStatoComponent,
    VenditaDettaglioStatoComponent,
    AccordionModule,
    FormInputSelectComponent,
    FormInputRadiobuttonComponent,
    ClienteLookupDirective,
    ContoBancarioLookupDirective,
    VenditaStatoSpedizioneLookupDirective,
    VenditaDettaglioStatoStampaLookupDirective,
    MenuModule,
    ConfirmDialogModule
  ],
  providers: [
    VenditaService
  ],
  templateUrl: './vendita-listing.component.html',
  styleUrl: './vendita-listing.component.scss'
})
export class VenditaListingComponent implements OnInit, OnDestroy {
  // Data properties
  vendite: VenditaListingModel[] = [];
  ultimiTreMesi: number = 0;
  ultimiTreMesiSospese: number = 0;
  totalRecords: number = 0;
  loading: boolean = false;
  expandedRows: any = {};
  selectedVendite: VenditaListingModel[] = [];

  // Filter properties
  filtri: VenditaListingFiltri = {
    offset: 0,
    limit: 100,
    search: ''
  };

  multipleAzioni: MenuItem[] = [
    {
      label: 'Modifica conto bancario',
      icon: 'pi pi-credit-card',
      command: () => {
        this.modificaContoBancarioVisible = true;
      }
    }
  ];

  modificaContoBancarioVisible: boolean = false;
  modificaContoBancarioModel: VenditaModificaContoBancarioModel = {
    vendite_ids: [],
    conto_bancario_id: 0
  };

  venditaHighlight?: number = undefined;

  // Delete dialog properties
  deleteDialogVisible: boolean = false;
  venditaToDelete?: VenditaListingModel;

  @ViewChild('confirmDialogModificaContoBancario') confirmDialogModificaContoBancario?: ConfirmDialog;
  @ViewChild('confirmDialogDelete') confirmDialogDelete?: ConfirmDialog;

  private venditeSubscription?: Subscription;
  private venditaDeleteSubscription?: Subscription;
  private loadingTimeout?: number;

  protected readonly VenditaDettaglioStatoStampaEnum = VenditaDettaglioStatoStampaEnum;

  constructor(
    private venditaService: VenditaService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private activatedRoute: ActivatedRoute,
    public applicationState: ApplicationStateService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.stato_spedizione) {
        this.filtri.stato_spedizione = params.stato_spedizione;
      }

      if (params.stato_stampa) {
        this.filtri.stato_stampa = params.stato_stampa;
      }

      if (params.isInScadenza) {
        this.filtri.isInScadenza = true;
      }

      if (params.isScaduto) {
        this.filtri.isScaduto = true;
      }

      if (params.conto_bancario_id) {
        this.filtri.conto_bancario_id = params.conto_bancario_id;
      }
    });
  }

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
          this.ultimiTreMesi = response.ultimiTreMesi;
          this.ultimiTreMesiSospese = response.ultimiTreMesiSospese;

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

  filterRadioButton(type: string): void {
    if (type === 'in_scadenza') {
      this.filtri.isInScadenza = true;
      this.filtri.isScaduto = false;
    }
    else if (type === 'scaduto') {
      this.filtri.isScaduto = true;
      this.filtri.isInScadenza = false;
    }

    this.loadVendite();
  }

  loadData(event: TableLazyLoadEvent): void {
    this.filtri.offset = event.first;
    this.filtri.limit = event.rows ?? 100;

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

    const dataScadenzaSpedizioneFilter: FilterMetadata | FilterMetadata[] | undefined = event.filters?.['data_scadenza_spedizione'];
    if (dataScadenzaSpedizioneFilter) {
      let value = null;
      let operator = null;

      if (dataScadenzaSpedizioneFilter instanceof Array) {
        value = dataScadenzaSpedizioneFilter[0].value;
        operator = dataScadenzaSpedizioneFilter[0].matchMode;
      } else {
        value = dataScadenzaSpedizioneFilter.value;
        operator = dataScadenzaSpedizioneFilter.matchMode;
      }

      if (value && operator) {
        this.filtri.data_scadenza_spedizione = {
          value: value,
          operator: operator
        };
      } else {
        this.filtri.data_scadenza_spedizione = undefined;
      }
    }
    else {
      this.filtri.data_scadenza_spedizione = undefined;
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
      limit: 100,
      search: ''
    };

    this.loadData({
      first: 0,
      rows: 100,
      globalFilter: '',
      sortField: 'data_vendita',
      sortOrder: -1
    });
  }

  editVendita(vendita: VenditaListingModel): void {
  this.router.navigate(['/vendita/manager', vendita.id]);
}

viewAuditLog(vendita: VenditaListingModel): void {
  let config: DynamicDialogConfig = {
    width: '90%',
    height: '80%',
    modal: true,
    dismissableMask: true,
    closable: true,
    showHeader: false,
    contentStyle: {
      'height': '100%',
      'width': '100%',
      'padding': '0px'
    },
    data: {
      tableName: 'T_VENDITE',
      recordId: vendita.id,
      objectName: `Vendita ${vendita.id.toString()}`
    }
  };
  this.dialogService.open(AuditLogComponent, config);
}

confirmDelete(event: Event, vendita: VenditaListingModel): void {
    this.venditaToDelete = vendita;
    this.deleteDialogVisible = true;
  }

  deleteVendita(id: number): void {
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

          // Hide dialog and clear venditaToDelete
          this.deleteDialogVisible = false;
          this.venditaToDelete = undefined;

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

  modificaStatoBasetta(basetta: VenditaListingDettaglioBasettaModel): void {
    if (this.loadingTimeout == null) {
      this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);
    }

    this.venditaService.modificaStatoBasetta(basetta.id, basetta.stato_stampa)
      .subscribe({
        next: () => {
          window.clearTimeout(this.loadingTimeout);
          this.loadingTimeout = undefined;
          this.loading = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Stato di stampa basetta modificato con successo'
          });

          this.loadVendite();
        },
        error: (error) => {
          window.clearTimeout(this.loadingTimeout);
          this.loadingTimeout = undefined;
          this.loading = false;

          this.dialogService.open(DialogErrorComponent, {
            inputValues: {
              error: error
            },
            modal: true
          });

          console.error('Errore avanzamento stato basetta:', error);
        }
      });
  }

  modificaContoBancarioVendite(): void {
    this.modificaContoBancarioModel.vendite_ids = this.selectedVendite.map(vendita => vendita.id);

    this.venditaService.modificaContoBancarioVendite(this.modificaContoBancarioModel).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Conto bancario modificato con successo'
        });

        this.loadVendite();
      },
      error: (error) => {
        this.dialogService.open(DialogErrorComponent, {
          inputValues: {
            error: error
          },
          modal: true
        });
      },
      complete: () => {
        this.modificaContoBancarioModel = {
          vendite_ids: [],
          conto_bancario_id: 0
        };
        this.modificaContoBancarioVisible = false;
        this.selectedVendite = [];
      }
    });
  }

  copiaLinkTracciamento(vendita: VenditaListingModel): void {
    if (!vendita.link_tracciamento) {
      return;
    }

    // Copy to clipboard
    navigator.clipboard.writeText(vendita.link_tracciamento)
      .then(() => {
        this.venditaHighlight = vendita.id;

        // Show success toast
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Il link tracciamento della vendita numero ${vendita.id} è stato copiato nella clipboard`
        });
      })
      .catch((error) => {
        console.error('Error copying to clipboard:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Errore durante la copia del link tracciamento'
        });
      });
  }
}