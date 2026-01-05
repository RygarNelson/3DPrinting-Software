import { Pipe, PipeTransform } from '@angular/core';
import { VenditaDettaglioStatoStampaEnum } from 'src/enums/VenditaDettaglioStatoStampaEnum';

@Pipe({
  name: 'venditaDettaglioStatoStampaIcon',
  standalone: true
})
export class VenditaDettaglioStatoStampaIconPipe implements PipeTransform {
  transform(value: VenditaDettaglioStatoStampaEnum | undefined): string {
    switch (value) {
      case VenditaDettaglioStatoStampaEnum.PiattoDaPreparare:
        return 'pi pi-folder';
      case VenditaDettaglioStatoStampaEnum.DaStampare:
        return 'pi pi-clock';
      case VenditaDettaglioStatoStampaEnum.StampaInCorso:
        return 'pi pi-print';
      case VenditaDettaglioStatoStampaEnum.DaControllare:
        return 'pi pi-camera';
      case VenditaDettaglioStatoStampaEnum.TerminatoConDifetti:
        return 'pi pi-exclamation-triangle';
      case VenditaDettaglioStatoStampaEnum.TerminatoSenzaDifetti:
        return 'pi pi-check-circle';
      default:
        return '';
    }
  }
}
