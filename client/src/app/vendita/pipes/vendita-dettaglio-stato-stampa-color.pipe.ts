import { Pipe, PipeTransform } from '@angular/core';
import { VenditaDettaglioStatoStampaColorRecord, VenditaDettaglioStatoStampaEnum } from 'src/enums/VenditaDettaglioStatoStampaEnum';

@Pipe({
  name: 'venditaDettaglioStatoStampaColor',
  standalone: true
})
export class VenditaDettaglioStatoStampaColorPipe implements PipeTransform {
  private readonly VenditaDettaglioStatoStampaColorRecord = VenditaDettaglioStatoStampaColorRecord;

  transform(value: VenditaDettaglioStatoStampaEnum | undefined): string {
    if (value == null) {
      return '#9E9E9E'; // Grey
    }
    return this.VenditaDettaglioStatoStampaColorRecord[value] || '#9E9E9E';
  }
}
