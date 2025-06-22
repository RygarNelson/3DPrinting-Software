import { Pipe, PipeTransform } from '@angular/core';
import { ErrorsViewModel } from 'src/models/ErrorsViewModel';

@Pipe({
  name: 'showError'
})
export class ShowErrorPipe implements PipeTransform {

  transform(property: string, listaErrori: ErrorsViewModel[]): boolean {
    return listaErrori.some(e => e.path === property);
  }

}
