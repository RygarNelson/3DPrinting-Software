import { Pipe, PipeTransform } from '@angular/core';
import { AuditLog } from '../../services/log.service';

@Pipe({
  name: 'groupClientInfo',
  standalone: true,
  pure: true
})
export class GroupClientInfoPipe implements PipeTransform {
  transform(logs: AuditLog[]): { ip_address?: string; user_agent?: string; additional_data?: any } {
    // Return shared client info from the first log
    const firstLog = logs?.[0];
    return {
      ip_address: firstLog?.ip_address,
      user_agent: firstLog?.user_agent,
      additional_data: firstLog?.additional_data
    };
  }
}
