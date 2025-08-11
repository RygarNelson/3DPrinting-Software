import { Pipe, PipeTransform } from '@angular/core';
import { AuditLog } from '../../services/log.service';

@Pipe({
  name: 'groupOperation',
  standalone: true,
  pure: true
})
export class GroupOperationPipe implements PipeTransform {
  transform(logs: AuditLog[]): AuditLog | null {
    // Return the first log to get shared operation info
    return logs?.[0] || null;
  }
}
