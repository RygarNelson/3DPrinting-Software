import { Pipe, PipeTransform } from '@angular/core';
import { ErrorsViewModel } from 'src/models/ErrorsViewModel';

@Pipe({
  name: 'showTabError'
})
export class ShowTabErrorPipe implements PipeTransform {

  transform(listaErrori: ErrorsViewModel[], proprieta: string[]): boolean {
    return listaErrori.some(e => proprieta.some(p => e.path.includes(p)));
  }

}
