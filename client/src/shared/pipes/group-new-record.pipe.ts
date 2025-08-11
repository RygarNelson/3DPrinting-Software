import { Pipe, PipeTransform } from '@angular/core';
import { AuditLog } from '../../services/log.service';

@Pipe({
  name: 'groupNewRecord',
  standalone: true,
  pure: true
})
export class GroupNewRecordPipe implements PipeTransform {
  transform(logs: AuditLog[]): any {
    // Return the new record if any log has it
    const logWithNewRecord = logs?.find(log => log.new_record);
    return logWithNewRecord?.new_record || null;
  }
}
