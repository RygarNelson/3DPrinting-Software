import { Pipe, PipeTransform } from '@angular/core';
import { ErrorsViewModel } from 'src/models/ErrorsViewModel';

@Pipe({
  name: 'showError'
})
export class ShowErrorPipe implements PipeTransform {

  transform(property: string, listaErrori: ErrorsViewModel[], parent?: string, index?: number): boolean {
    return listaErrori.some(e => {
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
    });
  }

}
