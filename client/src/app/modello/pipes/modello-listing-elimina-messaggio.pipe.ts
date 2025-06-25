import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'modelloListingEliminaMessaggio'
})
export class ModelloListingEliminaMessaggioPipe implements PipeTransform {

  transform(isUsed: boolean): string {
    return isUsed ? 'Modello utilizzato in una o più vendite' : 'Elimina modello';
  }

}
