import { Pipe, PipeTransform } from '@angular/core';
import { AuditLog } from '../../services/log.service';

@Pipe({
  name: 'groupNewValues',
  standalone: true,
  pure: true
})
export class GroupNewValuesPipe implements PipeTransform {
  transform(logs: AuditLog[]): any {
    // Aggregate all new values from the group into a single object
    const newValues: any = {};
    logs?.forEach(log => {
      if (log.new_value !== undefined && log.new_value !== null) {
        const fieldName = log.field_name || 'value';
        newValues[fieldName] = log.new_value;
      }
    });
    return Object.keys(newValues).length > 0 ? newValues : null;
  }
}
