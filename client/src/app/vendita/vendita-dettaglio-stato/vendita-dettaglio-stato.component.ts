import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { VenditaDettaglioStatoStampaEnum } from 'src/enums/VenditaDettaglioStatoStampaEnum';

@Component({
  selector: 'vendita-dettaglio-stato',
  imports: [
    CommonModule,
    ChipModule
  ],
  templateUrl: './vendita-dettaglio-stato.component.html',
  styleUrl: './vendita-dettaglio-stato.component.scss'
})
export class VenditaDettaglioStatoComponent implements OnChanges {
  @Input() stato_stampa?: VenditaDettaglioStatoStampaEnum | undefined;
  @Input() isInSelect: boolean = false;

  protected readonly VenditaDettaglioStatoStampaEnum: typeof VenditaDettaglioStatoStampaEnum = VenditaDettaglioStatoStampaEnum;
  protected icon: string = '';
  protected descrizione: string = '';
  protected color: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    switch (this.stato_stampa) {
      case VenditaDettaglioStatoStampaEnum.DaStampare: {
        this.icon = 'pi pi-clock';
        this.descrizione = 'Da Stampare';
        this.color = '#FFC107';
        break;
      }
      case VenditaDettaglioStatoStampaEnum.StampaInCorso: {
        this.icon = 'pi pi-print';
        this.descrizione = 'In Corso';
        this.color = '#2196F3';
        break;
      }
      case VenditaDettaglioStatoStampaEnum.DaControllare: {
        this.icon = 'pi pi-camera';
        this.descrizione = 'Da Controllare';
        this.color = '#2196F3';
        break;
      }
      case VenditaDettaglioStatoStampaEnum.Fallito: {
        this.icon = 'pi pi-times';
        this.descrizione = 'Fallito';
        this.color = '#F44336';
        break;
      }
      case VenditaDettaglioStatoStampaEnum.TerminatoConDifetti: {
        this.icon = 'pi pi-exclamation-triangle';
        this.descrizione = 'Terminato Con Difetti';
        this.color = '#FF9800';
        break;
      }
      case VenditaDettaglioStatoStampaEnum.TerminatoSenzaDifetti: {
        this.icon = 'pi pi-check-circle';
        this.descrizione = 'Terminato';
        this.color = '#4CAF50';
        break;
      }
    }
  }
}
