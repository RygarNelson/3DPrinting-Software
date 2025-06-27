import { ClienteManagerComponent } from '@/cliente/cliente-manager/cliente-manager.component';
import { ModelloManagerComponent } from '@/modello/modello-manager/modello-manager.component';
import { StampanteManagerComponent } from '@/stampante/stampante-manager/stampante-manager.component';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { Subscription } from 'rxjs';
import { ClienteLookupDirective } from 'src/directives/cliente/cliente-lookup.directive';
import { ModelloLookupDirective } from 'src/directives/modello/modello-lookup.directive';
import { StampanteLookupDirective } from 'src/directives/stampante/stampante-lookup.directive';
import { VenditaDettaglioStatoStampaLookupDirective } from 'src/directives/vendita/vendita-dettaglio-stato-stampa-lookup.directive';
import { VenditaStatoSpedizioneLookupDirective } from 'src/directives/vendita/vendita-stato-spedizione-lookup.directive';
import { ErrorsViewModel } from 'src/models/ErrorsViewModel';
import { VenditaDettaglioManagerModel, VenditaManagerModel } from 'src/models/vendita/vendita-manager';
import { ApplicationStateService } from 'src/services/application-state.service';
import { VenditaService } from 'src/services/vendita.service';
import { DialogErrorComponent } from 'src/shared/dialog-error/dialog-error.component';
import { FormInputDatetimeComponent } from 'src/shared/form-input-datetime/form-input-datetime.component';
import { FormInputNumberComponent } from 'src/shared/form-input-number/form-input-number.component';
import { FormInputSelectComponent } from 'src/shared/form-input-select/form-input-select.component';
import { FormInputTextComponent } from 'src/shared/form-input-text/form-input-text.component';
import { ShowTabErrorPipe } from 'src/shared/pipes/show-tab-error.pipe';
import { VenditaDettaglioStatoComponent } from '../vendita-dettaglio-stato/vendita-dettaglio-stato.component';
import { VenditaStatoComponent } from '../vendita-stato/vendita-stato.component';

@Component({
  selector: 'app-vendita-manager',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TabsModule,
    FormInputTextComponent,
    FormInputNumberComponent,
    FormInputDatetimeComponent,
    FormInputSelectComponent,
    ClienteLookupDirective,
    VenditaStatoSpedizioneLookupDirective,
    TableModule,
    ConfirmPopupModule,
    ModelloLookupDirective,
    StampanteLookupDirective,
    VenditaDettaglioStatoStampaLookupDirective,
    ShowTabErrorPipe,
    VenditaDettaglioStatoComponent,
    VenditaStatoComponent
  ],
  providers: [
    VenditaService,
    ConfirmationService
  ],
  templateUrl: './vendita-manager.component.html',
  styleUrl: './vendita-manager.component.scss'
})
export class VenditaManagerComponent implements OnInit, OnDestroy {
  vendita: VenditaManagerModel = new VenditaManagerModel();
  listaErrori: ErrorsViewModel[] = [];
  loading: boolean = false;

  proprietaErrori: Array<string[]> = [
    ['data_vendita', 'data_scadenza', 'cliente_id', 'totale_vendita', 'stato_spedizione', 'link_tracciamento'],
    ['dettagli']
  ];

  private loadingTimeout?: number;
  private clienteRef?: DynamicDialogRef;
  private modelloRef?: DynamicDialogRef;
  private stampanteRef?: DynamicDialogRef;
  private clienteSubscription?: Subscription;
  private modelloSubscription?: Subscription;
  private stampanteSubscription?: Subscription;

  constructor(
    private venditaService: VenditaService,
    private router: Router,
    private route: ActivatedRoute,
    private MessageService: MessageService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private applicationStateService: ApplicationStateService
  ){
    this.clienteSubscription = this.applicationStateService.newCliente.subscribe((event) => {
      if (event.id != null) {
        this.clienteRef?.destroy();
        this.vendita.cliente_id = event.id;
        this.applicationStateService.clienteLookupUpdate.next();
      }
    });

    this.modelloSubscription = this.applicationStateService.newModello.subscribe((event) => {
      if (event.id != null && event.index != null) {
        this.modelloRef?.destroy();
        this.vendita.dettagli[event.index].modello_id = event.id;
        this.applicationStateService.modelloLookupUpdate.next();
      }
    });

    this.stampanteSubscription = this.applicationStateService.newStampante.subscribe((event) => {
      if (event.id != null && event.index != null) {
        this.stampanteRef?.destroy();
        this.vendita.dettagli[event.index].stampante_id = event.id;
        this.applicationStateService.stampanteLookupUpdate.next();
      }
    });
  }

  ngOnInit(): void {
    // Get router params
    this.route.params.subscribe(params => {
      this.vendita.id = params['id'] ? Number(params['id']) : 0;
      if (this.vendita.id) {
        this.getVendita();
      }
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.loadingTimeout);
    this.clienteSubscription?.unsubscribe();
    this.modelloSubscription?.unsubscribe();
    this.stampanteSubscription?.unsubscribe();
    this.clienteRef?.destroy();
    this.modelloRef?.destroy();
    this.stampanteRef?.destroy();
  }

  private getVendita(): void {
    this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);

    this.venditaService.getVendita(this.vendita.id).subscribe({
      next: (result) => {
        clearTimeout(this.loadingTimeout);
        this.loading = false;

        if (result.success) {
          this.vendita = result.data;
        } else {
          this.dialogService.open(DialogErrorComponent, {
            inputValues: {
              error: result
            },
            modal: true
          });
          
          console.error(result);
        }
      },
      error: (error: any) => {
        clearTimeout(this.loadingTimeout);
        this.loading = false;

        console.error(error);
      }
    });
  }

  saveVendita(): void {
    this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);

    this.venditaService.save(this.vendita).subscribe({
      next: () => {
        clearTimeout(this.loadingTimeout);
        this.loading = false;

        this.MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Vendita salvata con successo'
        });

        this.indietro();
      },
      error: (error: any) => {
        clearTimeout(this.loadingTimeout);
        this.loading = false;

        if (error.status === 400) {
          this.MessageService.add({
            severity: 'error',
            summary: 'Errore',
            detail: 'Errore durante il salvataggio della vendita'
          });

          this.listaErrori = error.error.technical_data;
          console.error(this.listaErrori);
        }
        else {
          this.dialogService.open(DialogErrorComponent, {
            inputValues: {
              error: error
            },
            modal: true
          });
        }
      }
    });
  }

  addCliente(): void {
    this.clienteRef = this.dialogService.open(ClienteManagerComponent, {
      showHeader: false,
      closeOnEscape: true,
      dismissableMask: true,
      style: {
        width: '75%'
      },
      contentStyle: {
        padding: '0px'
      },
      modal: true,
      inputValues: {
        isExternal: true
      }
    });
  }

  addModello(index: number): void {
    this.modelloRef = this.dialogService.open(ModelloManagerComponent, {
      showHeader: false,
      closeOnEscape: true,
      dismissableMask: true,
      style: {
        width: '75%'
      },
      contentStyle: {
        padding: '0px'
      },
      modal: true,
      inputValues: {
        venditaIndex: index,
        isExternal: true
      }
    });
  }

  addStampante(index: number): void {
    this.stampanteRef = this.dialogService.open(StampanteManagerComponent, {
      showHeader: false,
      closeOnEscape: true,
      dismissableMask: true,
      style: {
        width: '75%'
      },
      contentStyle: {
        padding: '0px'
      },
      modal: true,
      inputValues: {
        venditaIndex: index,
        isExternal: true
      }
    });
  }

  addDettaglio(): void {
    let dettaglio = new VenditaDettaglioManagerModel();
    dettaglio.vendita_id = this.vendita.id;

    this.vendita.dettagli.push(dettaglio);
  }

  confirmDeleteDettaglio(event: Event, dettaglio: VenditaDettaglioManagerModel, index: number): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Sei sicuro di voler eliminare il dettaglio?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      acceptIcon: 'pi pi-exclamation-triangle',
      rejectIcon: 'pi pi-times',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.deleteDettaglio(dettaglio, index);
      },
      reject: () => {
        // User rejected the deletion
      }
    });
  }

  deleteDettaglio(dettaglio: VenditaDettaglioManagerModel, index: number): void {
    this.vendita.dettagli.splice(index, 1);
  }

  indietro(): void {
    this.router.navigate(['/vendita']);
  }
}
