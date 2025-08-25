import { ClienteManagerComponent } from '@/cliente/cliente-manager/cliente-manager.component';
import { ContoBancarioManagerComponent } from '@/conto-bancario/conto-bancario-manager/conto-bancario-manager.component';
import { ModelloManagerComponent } from '@/modello/modello-manager/modello-manager.component';
import { ModelloTipoComponent } from '@/modello/modello-tipo/modello-tipo.component';
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
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';
import { BaseManager } from 'src/classes/base-manager';
import { ClienteLookupDirective } from 'src/directives/cliente/cliente-lookup.directive';
import { ContoBancarioLookupDirective } from 'src/directives/conto-bancario/conto-bancario-lookup.directive';
import { ModelloLookupDirective } from 'src/directives/modello/modello-lookup.directive';
import { StampanteLookupDirective } from 'src/directives/stampante/stampante-lookup.directive';
import { VenditaDettaglioStatoStampaLookupDirective } from 'src/directives/vendita/vendita-dettaglio-stato-stampa-lookup.directive';
import { VenditaStatoSpedizioneLookupDirective } from 'src/directives/vendita/vendita-stato-spedizione-lookup.directive';
import { ModelloTipoEnum } from 'src/enums/ModelloTipoEnum';
import { VenditaDettaglioStatoStampaEnum } from 'src/enums/VenditaDettaglioStatoStampaEnum';
import { LookupInterface } from 'src/interfaces/lookup.interface';
import { VenditaDettaglioManagerModel, VenditaManagerModel } from 'src/models/vendita/vendita-manager';
import { ApplicationStateService } from 'src/services/application-state.service';
import { ClienteService } from 'src/services/cliente.service';
import { LocalstorageService } from 'src/services/localstorage.service';
import { VenditaService } from 'src/services/vendita.service';
import { DialogErrorComponent } from 'src/shared/dialog-error/dialog-error.component';
import { FormInputCheckboxComponent } from 'src/shared/form-input-checkbox/form-input-checkbox.component';
import { FormInputDatetimeComponent } from 'src/shared/form-input-datetime/form-input-datetime.component';
import { FormInputNumberComponent } from 'src/shared/form-input-number/form-input-number.component';
import { FormInputSelectComponent } from 'src/shared/form-input-select/form-input-select.component';
import { FormInputTextComponent } from 'src/shared/form-input-text/form-input-text.component';
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
    FormInputCheckboxComponent,
    ClienteLookupDirective,
    VenditaStatoSpedizioneLookupDirective,
    TableModule,
    ConfirmPopupModule,
    ModelloLookupDirective,
    StampanteLookupDirective,
    VenditaDettaglioStatoStampaLookupDirective,
    VenditaDettaglioStatoComponent,
    VenditaStatoComponent,
    ModelloTipoComponent,
    TooltipModule,
    ContoBancarioLookupDirective
  ],
  providers: [
    VenditaService,
    ClienteService,
  ],
  templateUrl: './vendita-manager.component.html',
  styleUrl: './vendita-manager.component.scss'
})
export class VenditaManagerComponent extends BaseManager implements OnInit, OnDestroy {
  vendita: VenditaManagerModel = new VenditaManagerModel();

  private clienteRef?: DynamicDialogRef;
  private modelloRef?: DynamicDialogRef;
  private stampanteRef?: DynamicDialogRef;
  private contoBancarioRef?: DynamicDialogRef;
  private clienteSubscription?: Subscription;
  private modelloSubscription?: Subscription;
  private stampanteSubscription?: Subscription;
  private contoBancarioSubscription?: Subscription;
  private contoBancarioLookupSubscription?: Subscription;

  protected override readonly LOCAL_STORAGE_KEY: string = 'vendita-manager';
  protected ModelloTipoEnum = ModelloTipoEnum;

  constructor(
    private venditaService: VenditaService,
    private router: Router,
    private route: ActivatedRoute,
    private MessageService: MessageService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private applicationStateService: ApplicationStateService,
    private clienteService: ClienteService,
    private localStorageService: LocalstorageService
  ){
    super();

    this.clienteSubscription = this.applicationStateService.newCliente.subscribe({
      next: (event) => {
        if (event.id != null) {
          this.vendita.cliente_id = event.id;
          this.applicationStateService.clienteLookupUpdate.next();
        }
  
        this.clienteRef?.close();
      }
    });

    this.modelloSubscription = this.applicationStateService.newModello.subscribe({
      next: (event) => {
        if (event.id != null && event.index != null) {
          this.vendita.dettagli[event.index].modello_id = event.id;
          this.applicationStateService.modelloLookupUpdate.next();
        }
  
        this.modelloRef?.close();
      }
    });

    this.stampanteSubscription = this.applicationStateService.newStampante.subscribe({
      next: (event) => {
        if (event.id != null && event.index != null) {
          this.vendita.dettagli[event.index].stampante_id = event.id;
          this.applicationStateService.stampanteLookupUpdate.next();
        }
  
        this.stampanteRef?.close();
      }
    });

    this.contoBancarioSubscription = this.applicationStateService.newContoBancario.subscribe({
      next: (event) => {
        if (event.id != null) {
          this.vendita.conto_bancario_id = event.id;
          this.applicationStateService.contoBancarioLookupUpdate.next();
        }
  
        this.contoBancarioRef?.close();
      }
    });

    this.contoBancarioLookupSubscription = this.applicationStateService.contoBancarioLookup.subscribe({
      next: (event) => {
        if (event != null && event.length == 1) {
          this.vendita.conto_bancario_id = event[0].id;
        }
      }
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        this.vendita.id = params['id'] ? Number(params['id']) : 0;
        if (this.vendita.id) {
          this.getVendita();
        } else if (this.localStorageService.hasItem(this.LOCAL_STORAGE_KEY)) {
          this.vendita = this.localStorageService.getObject(this.LOCAL_STORAGE_KEY);
        } else {
          this.getClienteVintedId();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.clearLoadingTimeout();

    if (this.hasSaved) {
      this.localStorageService.removeItem(this.LOCAL_STORAGE_KEY);
    } else if (!this.hasSaved && this.vendita.id == 0) {
      this.localStorageService.setObject(this.LOCAL_STORAGE_KEY, this.vendita);
    }

    this.clienteSubscription?.unsubscribe();
    this.modelloSubscription?.unsubscribe();
    this.stampanteSubscription?.unsubscribe();
    this.contoBancarioSubscription?.unsubscribe();
    this.contoBancarioLookupSubscription?.unsubscribe();
    this.clienteRef?.destroy();
    this.modelloRef?.destroy();
    this.stampanteRef?.destroy();
  }

  private getVendita(): void {
    this.setLoadingTimeout();

    this.venditaService.getVendita(this.vendita.id).subscribe({
      next: (result) => {
        this.clearLoadingTimeout();

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
        this.clearLoadingTimeout();

        console.error(error);
      }
    });
  }

  private getClienteVintedId(): void {
    this.clienteService.getClienteVintedId().subscribe({
      next: (result) => {
        this.vendita.cliente_id = result.data;
        this.applicationStateService.clienteLookupUpdate.next();
      }
    });
  }

  impostaDateScadenze(): void {
    if (this.vendita.data_vendita) {
      this.vendita.data_scadenza = new Date(this.vendita.data_vendita);
      this.vendita.data_scadenza_spedizione = new Date(this.vendita.data_vendita);

      // 8 giorni per la scadenza
      this.vendita.data_scadenza.setDate(this.vendita.data_vendita.getDate() + 8);
      // 10 giorni per la spedizione
      this.vendita.data_scadenza_spedizione.setDate(this.vendita.data_vendita.getDate() + 10);
    } else {
      this.vendita.data_scadenza = undefined;
      this.vendita.data_scadenza_spedizione = undefined;
    }
  }

  saveVendita(): void {
    this.setLoadingTimeout();

    this.venditaService.save(this.vendita).subscribe({
      next: () => {
        this.clearLoadingTimeout();
        this.hasSaved = true;

        this.MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Vendita salvata con successo'
        });

        this.indietro();
      },
      error: (error: any) => {
        this.clearLoadingTimeout();

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

  addContoBancario(): void {
    this.contoBancarioRef = this.dialogService.open(ContoBancarioManagerComponent, {
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

  addDettaglio(): void {
    let dettaglio = new VenditaDettaglioManagerModel();
    dettaglio.vendita_id = this.vendita.id;
    dettaglio.quantita = 1;

    this.vendita.dettagli.push(dettaglio);
  }

  cloneDettaglio(dettaglio: VenditaDettaglioManagerModel): void {
    const dettaglio_string = JSON.stringify(dettaglio);

    let clone = JSON.parse(dettaglio_string);
    clone.id = 0;
    clone.vendita_id = this.vendita.id;
    clone.quantita = 1;

    this.vendita.dettagli.push(clone);
    this.ricalcolaBasette();
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
    this.ricalcolaBasette();
  }

  checkDettaglio(dettaglio: VenditaDettaglioManagerModel): void {
    if (dettaglio.stampa_is_pezzo_singolo && dettaglio.stampa_is_parziale) {
      setTimeout(() => {
        dettaglio.stampa_is_pezzo_singolo = true;
        dettaglio.stampa_is_parziale = false;
      });
    }
  }

  impostaDettaglioBasetta(modello: LookupInterface | null, index: number): void {
    if (modello != null && modello.altriDati != null) {
      this.vendita.dettagli[index].basetta_dimensione = modello.altriDati.basetta_dimensione;
      this.vendita.dettagli[index].basetta_quantita = modello.altriDati.basetta_quantita;
    } else {
      this.vendita.dettagli[index].basetta_dimensione = undefined;
      this.vendita.dettagli[index].basetta_quantita = undefined;
    }

    this.ricalcolaBasette();
  }

  ricalcolaBasette(): void {
    // First take all dettagli which have basetta_dimensione and basetta_quantita and quantita
    const dettagliCalcolabili = this.vendita.dettagli.filter(d => d.basetta_dimensione != null && d.basetta_quantita != null && d.quantita != null);

    if (dettagliCalcolabili != null && dettagliCalcolabili.length > 0) {
      // Second, create a record for each dimension with the total quantity which is the multiplication of basetta_quantita and quantita
      let basette: Record<string, number> = {};

      dettagliCalcolabili.forEach((dettaglio) => {
        const dimensione = dettaglio.basetta_dimensione!;
        if (!basette[dimensione]) {
          basette[dimensione] = 0;
        }

        basette[dimensione] += dettaglio.basetta_quantita! * dettaglio.quantita!;
      });

      // Third, manipulate basette based on the record
      // If it doesn't have any entry, remove all basette which stato_stampa is not da_stampare
      if (Object.keys(basette).length === 0) {
        this.vendita.basette = this.vendita.basette.filter(b => b.stato_stampa != VenditaDettaglioStatoStampaEnum.DaStampare);
      } else {
        // Fourth, remove all basette which stato_stampa is not da_stampare that are not in the record
        this.vendita.basette = this.vendita.basette.filter(b => {
          return basette[b.dimensione] != null || (basette[b.dimensione] == null && b.stato_stampa != VenditaDettaglioStatoStampaEnum.DaStampare);
        });

        // Fifth, for each entry in the record, for loop
        Object.entries(basette).forEach(([dimensione, quantita]) => {
          // Check if the basetta already exists
          const basetta = this.vendita.basette.find(b => b.dimensione == dimensione);
          if (basetta != null && basetta.quantita != quantita) {
            // If it exists, update the quantity if the quantity is different
            basetta.quantita = quantita;
            basetta.stato_stampa = VenditaDettaglioStatoStampaEnum.DaStampare;
          } else if (basetta == null) {
            // If it doesn't exist, create a new basetta
            this.vendita.basette.push({
              id: 0,
              dimensione: dimensione,
              quantita: quantita,
              stato_stampa: VenditaDettaglioStatoStampaEnum.DaStampare
            });
          }
        });
      }
    } else {
      this.vendita.basette = [];
    }
  }

  indietro(): void {
    this.router.navigate(['/vendita']);
  }
}
