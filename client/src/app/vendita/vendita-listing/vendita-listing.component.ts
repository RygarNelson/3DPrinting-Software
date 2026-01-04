import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as ExcelJS from 'exceljs';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, FilterMetadata, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { SkeletonModule } from 'primeng/skeleton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription, forkJoin } from 'rxjs';
import { ClienteLookupDirective } from 'src/directives/cliente/cliente-lookup.directive';
import { ContoBancarioLookupDirective } from 'src/directives/conto-bancario/conto-bancario-lookup.directive';
import { VenditaDettaglioStatoStampaLookupDirective } from 'src/directives/vendita/vendita-dettaglio-stato-stampa-lookup.directive';
import { VenditaStatoSpedizioneLookupDirective } from 'src/directives/vendita/vendita-stato-spedizione-lookup.directive';
import { SpesaTipoEnum, SpesaTipoEnumRecord } from 'src/enums/SpesaTipoEnum';
import { SpesaUnitaMisuraEnum, SpesaUnitaMisuraEnumRecord } from 'src/enums/SpesaUnitaMisuraEnum';
import { VenditaDettaglioStatoStampaEnum } from 'src/enums/VenditaDettaglioStatoStampaEnum';
import { VenditaStatoSpedizioneEnumRecord } from 'src/enums/VenditaStatoSpedizioneEnum';
import { SpesaListingFiltri } from 'src/models/spesa/spesa-listing-filtri';
import { VenditaListingDettaglioBasettaModel, VenditaListingDettaglioModel, VenditaListingModel, VenditaListingResponse } from 'src/models/vendita/vendita-listing';
import { VenditaListingFiltri } from 'src/models/vendita/vendita-listing-filtri';
import { VenditaModificaContoBancarioModel } from 'src/models/vendita/vendita_modifica_conto_bancario';
import { VenditaModificaLinkTracciamentoModel } from 'src/models/vendita/vendita_modifica_link_tracciamento';
import { ApplicationStateService } from 'src/services/application-state.service';
import { SpesaService } from 'src/services/spesa.service';
import { VenditaService } from 'src/services/vendita.service';
import { AuditLogComponent } from 'src/shared/audit-log/audit-log.component';
import { DialogErrorComponent } from 'src/shared/dialog-error/dialog-error.component';
import { FormInputRadiobuttonComponent } from 'src/shared/form-input-radiobutton/form-input-radiobutton.component';
import { FormInputSelectComponent } from 'src/shared/form-input-select/form-input-select.component';
import { FormInputTextComponent } from 'src/shared/form-input-text/form-input-text.component';
import { MobileCardItemComponent } from 'src/shared/mobile-card-item/mobile-card-item.component';
import { VenditaDettaglioStatoComponent } from '../vendita-dettaglio-stato/vendita-dettaglio-stato.component';
import { VenditaEtichettaSpedizioneComponent } from '../vendita-etichetta-spedizione/vendita-etichetta-spedizione.component';
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
    FormInputTextComponent,
    ClienteLookupDirective,
    ContoBancarioLookupDirective,
    VenditaStatoSpedizioneLookupDirective,
    VenditaDettaglioStatoStampaLookupDirective,
    MenuModule,
    SplitButtonModule,
    ConfirmDialogModule,
    VenditaEtichettaSpedizioneComponent,
    DialogModule,
    DrawerModule,
    DatePickerModule,
    CheckboxModule,
    MobileCardItemComponent
  ],
  providers: [VenditaService, SpesaService],
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
    search: '',
    data_vendita: { value: undefined, operator: 'dateIs' },
    data_scadenza: { value: undefined, operator: 'dateIs' },
    data_scadenza_spedizione: { value: undefined, operator: 'dateIs' }
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
    },
    {
      separator: true
    },
    {
      label: 'Esporta Excel',
      icon: 'pi pi-file-excel',
      command: () => {
        this.exportToExcel();
      }
    },
    {
      label: 'Modifica conto bancario',
      icon: 'pi pi-credit-card',
      disabled: this.selectedVendite.length === 0,
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

  modificaLinkTracciamentoVisible: boolean = false;
  modificaLinkTracciamentoModel: VenditaModificaLinkTracciamentoModel = {
    venditaId: 0,
    linkTracciamento: ''
  };

  venditaHighlight?: number = undefined;

  etichettaSpedizioneDialogVisible: boolean = false;
  venditaForEtichetta?: VenditaListingModel;

  // Delete dialog properties
  deleteDialogVisible: boolean = false;
  venditaToDelete?: VenditaListingModel;

  @ViewChild('confirmDialogModificaContoBancario') confirmDialogModificaContoBancario?: ConfirmDialog;
  @ViewChild('confirmDialogDelete') confirmDialogDelete?: ConfirmDialog;
  @ViewChild('dataTable') dataTable?: Table;

  private venditeSubscription?: Subscription;
  private venditaDeleteSubscription?: Subscription;
  private loadingTimeout?: number;

  protected readonly VenditaDettaglioStatoStampaEnum = VenditaDettaglioStatoStampaEnum;

  constructor(
    private venditaService: VenditaService,
    private spesaService: SpesaService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private activatedRoute: ActivatedRoute,
    public applicationState: ApplicationStateService
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
    this.loading = true;

    this.venditeSubscription = this.venditaService.getListing(this.filtri).subscribe({
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
    } else if (type === 'scaduto') {
      this.filtri.isScaduto = true;
      this.filtri.isInScadenza = false;
    }

    this.loadVendite();
  }

  toggleSidebarFilters(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  applicaSidebarFiltri(): void {
    this.sidebarVisible = false;
    this.loadVendite();
  }

  resetSidebarFiltri(): void {
    this.pulisciFiltri();
    this.sidebarVisible = false;
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

    // Filtro id
    const idFilter: FilterMetadata | FilterMetadata[] | undefined = event.filters?.['id'];
    if (idFilter) {
      let value = null;
      let operator = null;

      if (idFilter instanceof Array) {
        value = idFilter[0].value;
        operator = idFilter[0].matchMode;
      } else {
        value = idFilter.value;
        operator = idFilter.matchMode;
      }

      if (value && operator) {
        this.filtri.id = {
          value: value,
          operator: operator
        };
      } else {
        this.filtri.id = undefined;
      }
    } else {
      this.filtri.id = undefined;
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
        this.filtri.data_vendita = { value: undefined, operator: 'dateIs' };
      }
    } else {
      this.filtri.data_vendita = { value: undefined, operator: 'dateIs' };
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
        this.filtri.data_scadenza = { value: undefined, operator: 'dateIs' };
      }
    } else {
      this.filtri.data_scadenza = { value: undefined, operator: 'dateIs' };
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
        this.filtri.data_scadenza_spedizione = { value: undefined, operator: 'dateIs' };
      }
    } else {
      this.filtri.data_scadenza_spedizione = { value: undefined, operator: 'dateIs' };
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
    } else {
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
      search: '',
      data_vendita: { value: undefined, operator: 'dateIs' },
      data_scadenza: { value: undefined, operator: 'dateIs' },
      data_scadenza_spedizione: { value: undefined, operator: 'dateIs' }
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
        height: '100%',
        width: '100%',
        padding: '0px'
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
    this.loading = true;

    this.venditaDeleteSubscription = this.venditaService.delete(id).subscribe({
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
    this.loading = true;

    this.venditaService.modificaStatoVendita(vendita.id, vendita.stato_spedizione).subscribe({
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
    this.loading = true;

    this.venditaService.modificaStatoDettaglio(dettaglio.id, dettaglio.stato_stampa).subscribe({
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
    this.loading = true;

    this.venditaService.modificaStatoBasetta(basetta.id, basetta.stato_stampa).subscribe({
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
    this.modificaContoBancarioModel.vendite_ids = this.selectedVendite.map((vendita) => vendita.id);

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

  openModificaLinkTracciamento(vendita: VenditaListingModel): void {
    this.modificaLinkTracciamentoModel.venditaId = vendita.id;
    this.modificaLinkTracciamentoModel.linkTracciamento = '';
    this.modificaLinkTracciamentoVisible = true;
  }

  modificaLinkTracciamento(): void {
    this.venditaService.modificaLinkTracciamento(this.modificaLinkTracciamentoModel).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Link tracciamento modificato con successo'
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
        this.modificaLinkTracciamentoModel = {
          venditaId: 0,
          linkTracciamento: ''
        };
        this.modificaLinkTracciamentoVisible = false;
        this.selectedVendite = [];
      }
    });
  }

  openEtichettaSpedizioneDialog(vendita: VenditaListingModel): void {
    this.venditaForEtichetta = vendita;
    this.etichettaSpedizioneDialogVisible = true;
  }

  copiaLinkTracciamento(vendita: VenditaListingModel): void {
    if (!vendita.link_tracciamento) {
      return;
    }

    // Copy to clipboard
    navigator.clipboard
      .writeText(vendita.link_tracciamento)
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

  // Helper function to get date-only in Rome timezone (for Excel date columns)
  private getDateInRomeTimezone(date: Date): Date | null {
    if (!date) return null;

    // Get Rome date parts using Intl
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Rome',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(date);

    const year = +parts.find((p) => p.type === 'year')!.value;
    const month = +parts.find((p) => p.type === 'month')!.value;
    const day = +parts.find((p) => p.type === 'day')!.value;

    // IMPORTANT: create date at UTC midnight
    return new Date(Date.UTC(year, month - 1, day));
  }

  exportToExcel(): void {
    this.loading = true;

    // Fetch all vendite with a high limit
    const exportFiltri: VenditaListingFiltri = {
      offset: 0,
      limit: 10000, // High limit to get all vendite
      search: this.filtri.search
    };

    // Copy other filters if they exist
    if (this.filtri.stato_spedizione !== undefined) {
      exportFiltri.stato_spedizione = this.filtri.stato_spedizione;
    }
    if (this.filtri.stato_stampa !== undefined) {
      exportFiltri.stato_stampa = this.filtri.stato_stampa;
    }
    if (this.filtri.isInScadenza !== undefined) {
      exportFiltri.isInScadenza = this.filtri.isInScadenza;
    }
    if (this.filtri.isScaduto !== undefined) {
      exportFiltri.isScaduto = this.filtri.isScaduto;
    }
    if (this.filtri.conto_bancario_id !== undefined) {
      exportFiltri.conto_bancario_id = this.filtri.conto_bancario_id;
    }
    if (this.filtri.cliente_id !== undefined) {
      exportFiltri.cliente_id = this.filtri.cliente_id;
    }

    // Fetch all spese with a high limit
    const spesaFiltri: SpesaListingFiltri = {
      offset: 0,
      limit: 10000, // High limit to get all spese
      search: ''
    };

    // Fetch both vendite and spese in parallel
    forkJoin({
      vendite: this.venditaService.getListing(exportFiltri),
      spese: this.spesaService.getListing(spesaFiltri)
    }).subscribe({
      next: ({ vendite, spese }) => {
        window.clearTimeout(this.loadingTimeout);
        this.loading = false;

        // Create workbook
        const workbook = new ExcelJS.Workbook();

        // Create Vendite sheet
        const venditeWorksheet = workbook.addWorksheet('Vendite');

        // Define columns for Vendite sheet
        venditeWorksheet.columns = [
          { header: 'Numero Vendita', key: 'numeroVendita', width: 15 },
          { header: 'Data Vendita', key: 'dataVendita', width: 12 },
          { header: 'Data Scadenza', key: 'dataScadenza', width: 12 },
          { header: 'Data Scadenza Spedizione', key: 'dataScadenzaSpedizione', width: 18 },
          { header: 'Cliente', key: 'cliente', width: 30 },
          { header: 'Conto Bancario', key: 'contoBancario', width: 25 },
          { header: 'Dettagli', key: 'dettagli', width: 50 },
          { header: 'Totale Vendita', key: 'totaleVendita', width: 18 },
          { header: 'Stato', key: 'stato', width: 20 }
        ];

        // Style header row
        venditeWorksheet.getRow(1).font = { bold: true };
        venditeWorksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        // Add data rows
        vendite.data.forEach((vendita) => {
          // Format dettagli
          const dettagliArray: string[] = [];
          if (vendita.dettagli && vendita.dettagli.length > 0) {
            vendita.dettagli.forEach((dettaglio) => {
              let dettaglioStr = '';
              if (dettaglio.modello && dettaglio.modello.nome) {
                dettaglioStr = dettaglio.modello.nome;
              } else if (dettaglio.descrizione) {
                dettaglioStr = dettaglio.descrizione;
              }

              if (dettaglio.stampa_is_pezzo_singolo) {
                dettaglioStr += ' (Pezzo singolo)';
              }
              if (dettaglio.stampa_is_parziale) {
                dettaglioStr += ' (Parziale)';
              }

              if (dettaglioStr) {
                dettagliArray.push(dettaglioStr);
              }
            });
          }
          const dettagliNormalized = dettagliArray.join(';');

          // Get status name
          const statoName = vendita.stato_spedizione !== undefined ? VenditaStatoSpedizioneEnumRecord[vendita.stato_spedizione] || '' : '';

          const row = venditeWorksheet.addRow({
            numeroVendita: vendita.id,
            dataVendita: null, // Will be set separately to ensure proper date type
            dataScadenza: null, // Will be set separately to ensure proper date type
            dataScadenzaSpedizione: null, // Will be set separately to ensure proper date type
            cliente: vendita.cliente?.etichetta || '',
            contoBancario: vendita.conto_bancario?.iban || '',
            dettagli: dettagliNormalized,
            totaleVendita: vendita.totale_vendita || 0,
            stato: statoName
          });

          // Format number columns
          row.getCell('numeroVendita').numFmt = '0';
          row.getCell('totaleVendita').numFmt = '#,##0.00';

          // Format date columns (Italian format: dd/mm/yyyy) and set cell type to date
          if (vendita.data_vendita) {
            const dateCell = row.getCell('dataVendita');
            dateCell.numFmt = 'dd/mm/yyyy';
            dateCell.value = this.getDateInRomeTimezone(new Date(vendita.data_vendita));
          }
          if (vendita.data_scadenza) {
            const dateCell = row.getCell('dataScadenza');
            dateCell.numFmt = 'dd/mm/yyyy';
            dateCell.value = this.getDateInRomeTimezone(new Date(vendita.data_scadenza));
          }
          if (vendita.data_scadenza_spedizione) {
            const dateCell = row.getCell('dataScadenzaSpedizione');
            dateCell.numFmt = 'dd/mm/yyyy';
            dateCell.value = this.getDateInRomeTimezone(new Date(vendita.data_scadenza_spedizione));
          }
        });

        // Autofit columns for Vendite sheet (excluding date columns which have fixed width)
        venditeWorksheet.columns.forEach((column, index) => {
          if (!column || !column.eachCell) return;

          // Skip date columns (indices 1, 2, 3) - they have fixed widths
          const dateColumnKeys = ['dataVendita', 'dataScadenza', 'dataScadenzaSpedizione'];
          if (column.key && dateColumnKeys.includes(column.key)) {
            return;
          }

          let maxLength = 0;
          column.eachCell({ includeEmpty: true }, (cell) => {
            const columnLength = cell.value ? cell.value.toString().length : 10;
            if (columnLength > maxLength) {
              maxLength = columnLength;
            }
          });
          column.width = maxLength < 10 ? 10 : maxLength + 2;
        });

        // Create Spese sheet
        const speseWorksheet = workbook.addWorksheet('Spese');

        // Define columns for Spese sheet
        speseWorksheet.columns = [
          { header: 'Numero', key: 'numero', width: 12 },
          { header: 'Data Spesa', key: 'dataSpesa', width: 12 },
          { header: 'Descrizione', key: 'descrizione', width: 40 },
          { header: 'Quantità', key: 'quantita', width: 12 },
          { header: 'Tipo Spesa', key: 'tipoSpesa', width: 15 },
          { header: 'Unità di Misura', key: 'unitaMisura', width: 18 },
          { header: 'Totale Spesa', key: 'totaleSpesa', width: 18 }
        ];

        // Style header row
        speseWorksheet.getRow(1).font = { bold: true };
        speseWorksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        // Add data rows
        spese.data.forEach((spesa) => {
          // Get tipo spesa name
          const tipoSpesaName = spesa.tipo_spesa !== undefined ? SpesaTipoEnumRecord[spesa.tipo_spesa as SpesaTipoEnum] || '' : '';

          // Get unità di misura name
          const unitaMisuraName = spesa.unita_misura !== undefined ? SpesaUnitaMisuraEnumRecord[spesa.unita_misura as SpesaUnitaMisuraEnum] || '' : '';

          const row = speseWorksheet.addRow({
            numero: spesa.id,
            dataSpesa: null, // Will be set separately to ensure proper date type
            descrizione: spesa.descrizione || '',
            quantita: spesa.quantita || 0,
            tipoSpesa: tipoSpesaName,
            unitaMisura: unitaMisuraName,
            totaleSpesa: spesa.totale_spesa || 0
          });

          // Format number columns
          row.getCell('numero').numFmt = '0';
          row.getCell('quantita').numFmt = '#,##0.0000';
          row.getCell('totaleSpesa').numFmt = '#,##0.00';

          // Format date column (Italian format: dd/mm/yyyy) and set cell type to date
          if (spesa.data_spesa) {
            const dateCell = row.getCell('dataSpesa');
            dateCell.numFmt = 'dd/mm/yyyy';
            dateCell.value = this.getDateInRomeTimezone(new Date(spesa.data_spesa));
          }
        });

        // Autofit columns for Spese sheet (excluding date column which has fixed width)
        speseWorksheet.columns.forEach((column) => {
          if (!column || !column.eachCell) return;

          // Skip date column - it has fixed width
          if (column.key === 'dataSpesa') {
            return;
          }

          let maxLength = 0;
          column.eachCell({ includeEmpty: true }, (cell) => {
            const columnLength = cell.value ? cell.value.toString().length : 10;
            if (columnLength > maxLength) {
              maxLength = columnLength;
            }
          });
          column.width = maxLength < 10 ? 10 : maxLength + 2;
        });

        // Generate Excel file and download
        workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `vendite_spese_${new Date().toISOString().split('T')[0]}.xlsx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        });

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'File Excel esportato con successo'
        });
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

        console.error('Error exporting to Excel:', error);
      }
    });
  }
}
