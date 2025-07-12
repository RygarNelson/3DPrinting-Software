import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contoBancarioListingEliminaMessaggio'
})
export class ContoBancarioListingEliminaMessaggioPipe implements PipeTransform {

  transform(isUsed: boolean): string {
    return isUsed ? 'Conto bancario utilizzato in una o più vendite' : 'Elimina conto bancario';
  }

}
