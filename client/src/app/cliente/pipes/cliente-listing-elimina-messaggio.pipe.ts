import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clienteListingEliminaMessaggio'
})
export class ClienteListingEliminaMessaggioPipe implements PipeTransform {

  transform(isUsed: boolean): string {
    return isUsed ? 'Cliente utilizzato in una o più vendite' : 'Elimina cliente';
  }

}
