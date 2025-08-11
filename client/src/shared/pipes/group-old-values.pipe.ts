import { Pipe, PipeTransform } from '@angular/core';
import { AuditLog } from '../../services/log.service';

@Pipe({
  name: 'groupOldValues',
  standalone: true,
  pure: true
})
export class GroupOldValuesPipe implements PipeTransform {
  transform(logs: AuditLog[]): any {
    // Aggregate all old values from the group into a single object
    const oldValues: any = {};
    logs?.forEach(log => {
      if (log.old_value !== undefined && log.old_value !== null) {
        const fieldName = log.field_name || 'value';
        oldValues[fieldName] = log.old_value;
      }
    });
    return Object.keys(oldValues).length > 0 ? oldValues : null;
  }
}
