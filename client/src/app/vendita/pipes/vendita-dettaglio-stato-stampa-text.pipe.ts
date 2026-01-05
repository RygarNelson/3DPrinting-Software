import { Pipe, PipeTransform } from '@angular/core';
import { VenditaDettaglioStatoStampaEnum, VenditaDettaglioStatoStampaEnumRecord } from 'src/enums/VenditaDettaglioStatoStampaEnum';

@Pipe({
  name: 'venditaDettaglioStatoStampaText'
})
export class VenditaDettaglioStatoStampaTextPipe implements PipeTransform {
  private readonly VenditaDettaglioStatoStampaEnumRecord = VenditaDettaglioStatoStampaEnumRecord;

  transform(value: VenditaDettaglioStatoStampaEnum | undefined): string {
    if (value == null) {
      return '';
    }
    return this.VenditaDettaglioStatoStampaEnumRecord[value];
  }
}
