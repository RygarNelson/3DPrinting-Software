import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'operationSeverity',
  standalone: true,
  pure: true
})
export class OperationSeverityPipe implements PipeTransform {
  transform(operation: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined | null {
    const severities: { [key: string]: 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined | null } = {
      'INSERT': 'success',
      'UPDATE': 'info',
      'DELETE': 'danger',
      'SOFT_DELETE': 'danger',
      'RESTORE': 'secondary'
    };
    return severities[operation] || 'info';
  }
}
