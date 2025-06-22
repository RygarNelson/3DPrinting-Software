import { Pipe, PipeTransform } from '@angular/core';
import { ErrorsViewModel } from 'src/models/ErrorsViewModel';

@Pipe({
  name: 'errorMessages'
})
export class ErrorMessagesPipe implements PipeTransform {

  transform(property: string, listaErrori: ErrorsViewModel[]): string[] {
    return listaErrori.filter(e => e.path === property).map(e => e.msg);
  }

}
