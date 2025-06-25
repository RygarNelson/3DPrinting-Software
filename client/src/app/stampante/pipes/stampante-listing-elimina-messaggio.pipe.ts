import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stampanteListingEliminaMessaggio'
})
export class StampanteListingEliminaMessaggioPipe implements PipeTransform {

  transform(isUsed: boolean): string {
    return isUsed ? 'Stampante utilizzata in una o più vendite' : 'Elimina stampante';
  }

}
