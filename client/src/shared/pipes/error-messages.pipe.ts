import { Pipe, PipeTransform } from '@angular/core';
import { ErrorsViewModel } from 'src/models/ErrorsViewModel';

@Pipe({
  name: 'errorMessages'
})
export class ErrorMessagesPipe implements PipeTransform {

  transform(property: string, listaErrori: ErrorsViewModel[], parent?: string, index?: number): string[] {
    return listaErrori.filter(e => {
      if (e.path === property) {
        // Simple case: direct property match
        return true;
      }
      if (parent !== undefined && index !== undefined) {
        // Complex case: match parent[index].property
        const expectedPath = `${parent}[${index}].${property}`;
        return e.path === expectedPath;
      }
      return false;
    }).map(e => e.msg);
  }

}
