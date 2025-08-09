import { Pipe, PipeTransform } from '@angular/core';
import { AuditLog } from '../../services/log.service';

@Pipe({
  name: 'groupOldRecord',
  standalone: true,
  pure: true
})
export class GroupOldRecordPipe implements PipeTransform {
  transform(logs: AuditLog[]): any {
    // Return the old record if any log has it
    const logWithOldRecord = logs?.find(log => log.old_record);
    return logWithOldRecord?.old_record || null;
  }
}
