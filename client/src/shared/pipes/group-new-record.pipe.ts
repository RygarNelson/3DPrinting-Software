import { Pipe, PipeTransform } from '@angular/core';
import { AuditLog } from '../../services/log.service';

@Pipe({
  name: 'groupNewRecord',
  standalone: true,
  pure: true
})
export class GroupNewRecordPipe implements PipeTransform {
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

    if (parentLog?.new_record) {
        record = parse(parentLog.new_record);
        
        // Ensure arrays exist
        if (!record.dettagli) record.dettagli = [];
        if (!record.basette) record.basette = [];
    }

    // 2. Find and merge child logs
    const childLogs = logs.filter(log => log.table_name !== 'T_VENDITE' && log.new_record);
    
    // If no parent record but we have child logs, we might need a container?
    // For now, only enrich if we have a parent record to attach to.
    if (record) {
        childLogs.forEach(childLog => {
            const childData = parse(childLog.new_record);
            
            if (childLog.table_name === 'T_VENDITE_DETTAGLI') {
                record.dettagli.push(childData);
            } else if (childLog.table_name === 'T_BASETTE') {
                record.basette.push(childData);
            }
        });
        
        // Return enriched record
        return record;
    }
    
    // Fallback: If no T_VENDITE log found (maybe just a child log update?), 
    // return the first available new_record
    const firstLog = logs.find(log => log.new_record);
    return firstLog ? parse(firstLog.new_record) : null;
  }
}
