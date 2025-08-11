import { Pipe, PipeTransform } from '@angular/core';
import { AuditLog } from 'src/services/log.service';

@Pipe({
  name: 'groupUser'
})
export class GroupUserPipe implements PipeTransform {

  transform(logs: AuditLog[]): { id?: number; name?: string; surname?: string; email?: string; } {
    // Return shared client info from the first log
    const firstLog = logs?.[0];
    return {
      id: firstLog?.user?.id,
      name: firstLog?.user?.name,
      surname: firstLog?.user?.surname,
      email: firstLog?.user?.email
    };
  }

}
