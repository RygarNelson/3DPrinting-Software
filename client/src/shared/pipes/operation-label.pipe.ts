import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'operationLabel',
  standalone: true,
  pure: true
})
export class OperationLabelPipe implements PipeTransform {
  transform(operation: string): string {
    const labels: { [key: string]: string } = {
      'INSERT': 'Inserimento',
      'UPDATE': 'Modifica',
      'DELETE': 'Eliminazione',
      'SOFT_DELETE': 'Soft Delete',
      'RESTORE': 'Ripristino'
    };
    return labels[operation] || operation;
  }
}
