import { Pipe, PipeTransform } from '@angular/core';
import { AuditLog } from '../../services/log.service';

@Pipe({
  name: 'groupTimestamp',
  standalone: true,
  pure: true
})
export class GroupTimestampPipe implements PipeTransform {
  transform(logs: AuditLog[]): string {
    // Return the timestamp of the first log in the group (since they're sorted)
    return logs?.[0]?.createdAt || '';
  }
}
