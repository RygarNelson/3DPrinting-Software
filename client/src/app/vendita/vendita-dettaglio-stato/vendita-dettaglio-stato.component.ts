import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { VenditaDettaglioStatoStampaEnum, VenditaDettaglioStatoStampaEnumRecord } from 'src/enums/VenditaDettaglioStatoStampaEnum';

@Component({
  selector: 'vendita-dettaglio-stato',
  imports: [CommonModule, ChipModule],
  templateUrl: './vendita-dettaglio-stato.component.html',
  styleUrl: './vendita-dettaglio-stato.component.scss'
})
export class VenditaDettaglioStatoComponent implements OnChanges {
  @Input() stato_stampa?: VenditaDettaglioStatoStampaEnum | undefined;
  @Input() isInSelect: boolean = false;

  protected readonly VenditaDettaglioStatoStampaEnum: typeof VenditaDettaglioStatoStampaEnum = VenditaDettaglioStatoStampaEnum;
  protected readonly VenditaDettaglioStatoStampaEnumRecord: typeof VenditaDettaglioStatoStampaEnumRecord = VenditaDettaglioStatoStampaEnumRecord;

  protected icon: string = '';
  protected descrizione: string = '';
  protected color: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (this.stato_stampa != null) {
      this.descrizione = this.VenditaDettaglioStatoStampaEnumRecord[this.stato_stampa];
    }

    switch (this.stato_stampa) {
      case VenditaDettaglioStatoStampaEnum.PiattoDaPreparare: {
        this.icon = 'pi pi-folder';
        this.color = '#FFC107';
        break;
      }
      case VenditaDettaglioStatoStampaEnum.DaStampare: {
        this.icon = 'pi pi-clock';
        this.color = '#FFC107';
        break;
      }
      case VenditaDettaglioStatoStampaEnum.StampaInCorso: {
        this.icon = 'pi pi-print';
        this.color = '#2196F3';
        break;
      }
      case VenditaDettaglioStatoStampaEnum.DaControllare: {
        this.icon = 'pi pi-camera';
        this.color = '#2196F3';
        break;
      }
      case VenditaDettaglioStatoStampaEnum.TerminatoConDifetti: {
        this.icon = 'pi pi-exclamation-triangle';
        this.color = '#FF9800';
        break;
      }
      case VenditaDettaglioStatoStampaEnum.TerminatoSenzaDifetti: {
        this.icon = 'pi pi-check-circle';
        this.color = '#4CAF50';
        break;
      }
    }
  }
}
