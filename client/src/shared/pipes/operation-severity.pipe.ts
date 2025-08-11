import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'operationSeverity',
  standalone: true,
  pure: true
})
export class OperationSeverityPipe implements PipeTransform {
  transform(operation: string): string {
    const severities: { [key: string]: string } = {
      'INSERT': 'success',
      'UPDATE': 'info',
      'DELETE': 'danger',
      'SOFT_DELETE': 'danger',
      'RESTORE': 'secondary'
    };
    return severities[operation] || 'info';
  }
}
