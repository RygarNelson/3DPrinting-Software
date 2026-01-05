import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { VenditaDettaglioStatoStampaColorRecord, VenditaDettaglioStatoStampaEnum, VenditaDettaglioStatoStampaEnumRecord, VenditaDettaglioStatoStampaIconRecord } from 'src/enums/VenditaDettaglioStatoStampaEnum';

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
  protected readonly VenditaDettaglioStatoStampaColorRecord = VenditaDettaglioStatoStampaColorRecord;
  protected readonly VenditaDettaglioStatoStampaIconRecord = VenditaDettaglioStatoStampaIconRecord;

  protected icon: string = '';
  protected descrizione: string = '';
  protected color: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (this.stato_stampa != null) {
      this.descrizione = this.VenditaDettaglioStatoStampaEnumRecord[this.stato_stampa];
      this.icon = this.VenditaDettaglioStatoStampaIconRecord[this.stato_stampa] || '';
      this.color = this.VenditaDettaglioStatoStampaColorRecord[this.stato_stampa] || '#9E9E9E';
    } else {
      this.descrizione = '';
      this.icon = '';
      this.color = '#9E9E9E';
    }
  }
}
