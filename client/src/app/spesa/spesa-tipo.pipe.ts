import { Pipe, PipeTransform } from '@angular/core';
import { SpesaTipoEnum, SpesaTipoEnumRecord } from 'src/enums/SpesaTipoEnum';

@Pipe({
  name: 'spesaTipo'
})
export class SpesaTipoPipe implements PipeTransform {

  transform(value: SpesaTipoEnum): string {
    const record = SpesaTipoEnumRecord[value];

    return record ? record : '-';
  }

}
