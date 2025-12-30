import { Pipe, PipeTransform } from '@angular/core';
import { AuditLog } from '../../services/log.service';

@Pipe({
  name: 'groupOldRecord',
  standalone: true,
  pure: true
})
export class GroupOldRecordPipe implements PipeTransform {
  transform(logs: AuditLog[]): any {
    if (!logs || logs.length === 0) return null;

    // 1. Find the main parent log (T_VENDITE)
    const parentLog = logs.find(log => log.table_name === 'T_VENDITE');
    let record = null;
    
    // Helper to safely parse JSON
    const parse = (val: any) => {
        if (typeof val === 'string') {
            try { return JSON.parse(val); } catch (e) { return val; }
        }
        return val;
    };

    if (parentLog?.old_record) {
        record = parse(parentLog.old_record);
        
        // Ensure arrays exist
        if (!record.dettagli) record.dettagli = [];
        if (!record.basette) record.basette = [];
    }

    // 2. Find and merge child logs
    const childLogs = logs.filter(log => log.table_name !== 'T_VENDITE' && log.old_record);
    
    // Only enrich if we have a parent record
    if (record) {
        childLogs.forEach(childLog => {
            const childData = parse(childLog.old_record);
            
            if (childLog.table_name === 'T_VENDITE_DETTAGLI') {
                record.dettagli.push(childData);
            } else if (childLog.table_name === 'T_BASETTE') {
                record.basette.push(childData);
            }
        });
        
        return record;
    }
    
    // Fallback
    const firstLog = logs.find(log => log.old_record);
    return firstLog ? parse(firstLog.old_record) : null;
  }
}
