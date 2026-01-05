import { Pipe, PipeTransform } from '@angular/core';
import { VenditaDettaglioStatoStampaEnum, VenditaDettaglioStatoStampaIconRecord } from 'src/enums/VenditaDettaglioStatoStampaEnum';

@Pipe({
  name: 'venditaDettaglioStatoStampaIcon',
  standalone: true
})
export class VenditaDettaglioStatoStampaIconPipe implements PipeTransform {
  private readonly VenditaDettaglioStatoStampaIconRecord = VenditaDettaglioStatoStampaIconRecord;

  transform(value: VenditaDettaglioStatoStampaEnum | undefined): string {
    if (value == null) {
      return '';
    }
    return this.VenditaDettaglioStatoStampaIconRecord[value] || '';
  }
}
