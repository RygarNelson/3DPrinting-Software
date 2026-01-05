import { Pipe, PipeTransform } from '@angular/core';
import { VenditaDettaglioStatoStampaEnum } from 'src/enums/VenditaDettaglioStatoStampaEnum';

@Pipe({
  name: 'venditaDettaglioStatoStampaColor',
  standalone: true
})
export class VenditaDettaglioStatoStampaColorPipe implements PipeTransform {
  transform(value: VenditaDettaglioStatoStampaEnum | undefined): string {
    switch (value) {
      case VenditaDettaglioStatoStampaEnum.PiattoDaPreparare:
      case VenditaDettaglioStatoStampaEnum.DaStampare:
        return '#FFC107'; // Amber
      case VenditaDettaglioStatoStampaEnum.StampaInCorso:
      case VenditaDettaglioStatoStampaEnum.DaControllare:
        return '#2196F3'; // Blue
      case VenditaDettaglioStatoStampaEnum.TerminatoConDifetti:
        return '#FF9800'; // Orange
      case VenditaDettaglioStatoStampaEnum.TerminatoSenzaDifetti:
        return '#4CAF50'; // Green
      default:
        return '#9E9E9E'; // Grey
    }
  }
}
