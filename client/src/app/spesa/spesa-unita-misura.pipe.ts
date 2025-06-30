import { Pipe, PipeTransform } from '@angular/core';
import { SpesaUnitaMisuraEnum, SpesaUnitaMisuraEnumRecord } from 'src/enums/SpesaUnitaMisuraEnum';

@Pipe({
  name: 'spesaUnitaMisura'
})
export class SpesaUnitaMisuraPipe implements PipeTransform {

  transform(value: SpesaUnitaMisuraEnum): string {
    const record = SpesaUnitaMisuraEnumRecord[value];
    
    return record ? record : '-';
  }

}
