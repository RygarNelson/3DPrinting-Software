import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';
import { AuditLog, LogService } from '../../services/log.service';
import { DialogErrorComponent } from '../dialog-error/dialog-error.component';
import { PrettyJsonPipe } from '../pipes/pretty-json.pipe';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    SkeletonModule,
    PrettyJsonPipe
  ],
  templateUrl: './audit-log.component.html',
  styleUrl: './audit-log.component.scss',
  providers: [LogService, DialogService]
})
export class AuditLogComponent implements OnInit, OnDestroy {
  logs: AuditLog[] = [];
  groupedLogs: { [key: number]: AuditLog[] } = {};
  groupedLogKeys: number[] = [];
  loading: boolean = false;
  private subscription?: Subscription;

  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private logService: LogService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  loadLogs(): void {
    const { tableName, recordId } = this.config.data;
    
    if (!tableName || !recordId) {
      console.error('Missing tableName or recordId in config');
      return;
    }

    this.loading = true;
    this.subscription = this.logService.getLogsForRecord(tableName, recordId)
      .subscribe({
        next: (response) => {
          this.logs = response.data;
          this.groupLogsByGroupId();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading audit logs:', error);
          this.loading = false;
          
          this.dialogService.open(DialogErrorComponent, {
            inputValues: { error },
            modal: true
          });
        }
      });
  }

  getOperationLabel(operation: string): string {
    const labels: { [key: string]: string } = {
      'INSERT': 'Inserimento',
      'UPDATE': 'Modifica',
      'DELETE': 'Eliminazione',
      'SOFT_DELETE': 'Soft Delete',
      'RESTORE': 'Ripristino'
    };
    return labels[operation] || operation;
  }

  getOperationSeverity(operation: string): string {
    const severities: { [key: string]: string } = {
      'INSERT': 'success',
      'UPDATE': 'info',
      'DELETE': 'danger',
      'SOFT_DELETE': 'danger',
      'RESTORE': 'secondary'
    };
    return severities[operation] || 'info';
  }

  private groupLogsByGroupId(): void {
    this.groupedLogs = {};
    
    // Group logs by group_id
    this.logs.forEach(log => {
      if (!this.groupedLogs[log.group_id]) {
        this.groupedLogs[log.group_id] = [];
      }
      this.groupedLogs[log.group_id].push(log);
    });
    
    // Sort groups by the most recent log in each group (descending)
    this.groupedLogKeys = Object.keys(this.groupedLogs)
      .map(key => Number(key))
      .sort((a, b) => {
        const aLatest = Math.max(...this.groupedLogs[a].map(log => new Date(log.createdAt).getTime()));
        const bLatest = Math.max(...this.groupedLogs[b].map(log => new Date(log.createdAt).getTime()));
        return bLatest - aLatest;
      });
    
    // Sort logs within each group by creation date (oldest first to show progression)
    Object.keys(this.groupedLogs).forEach(groupId => {
      this.groupedLogs[Number(groupId)].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });
  }

  getGroupOperationSummary(logs: AuditLog[]): string {
    const operations = logs.map(log => this.getOperationLabel(log.operation));
    const uniqueOperations = [...new Set(operations)];
    return uniqueOperations.join(', ');
  }

  getGroupTimestamp(logs: AuditLog[]): string {
    // Return the timestamp of the first log in the group (since they're sorted)
    return logs[0]?.createdAt || '';
  }

  getGroupOperation(logs: AuditLog[]): AuditLog {
    // Return the first log to get shared operation info
    return logs[0];
  }

  getGroupClientInfo(logs: AuditLog[]): { ip_address?: string; user_agent?: string; additional_data?: any } {
    // Return shared client info from the first log
    const firstLog = logs[0];
    return {
      ip_address: firstLog?.ip_address,
      user_agent: firstLog?.user_agent,
      additional_data: firstLog?.additional_data
    };
  }

  getGroupOldValues(logs: AuditLog[]): any {
    // Aggregate all old values from the group into a single object
    const oldValues: any = {};
    logs.forEach(log => {
      if (log.old_value !== undefined && log.old_value !== null) {
        const fieldName = log.field_name || 'value';
        oldValues[fieldName] = log.old_value;
      }
    });
    return Object.keys(oldValues).length > 0 ? oldValues : null;
  }

  getGroupNewValues(logs: AuditLog[]): any {
    // Aggregate all new values from the group into a single object
    const newValues: any = {};
    logs.forEach(log => {
      if (log.new_value !== undefined && log.new_value !== null) {
        const fieldName = log.field_name || 'value';
        newValues[fieldName] = log.new_value;
      }
    });
    return Object.keys(newValues).length > 0 ? newValues : null;
  }

  getGroupOldRecord(logs: AuditLog[]): any {
    // Return the old record if any log has it
    const logWithOldRecord = logs.find(log => log.old_record);
    return logWithOldRecord?.old_record || null;
  }

  getGroupNewRecord(logs: AuditLog[]): any {
    // Return the new record if any log has it
    const logWithNewRecord = logs.find(log => log.new_record);
    return logWithNewRecord?.new_record || null;
  }

  getObjectKeysLength(obj: any): number {
    // Helper method to get the number of keys in an object
    return obj ? Object.keys(obj).length : 0;
  }

  close(): void {
    this.ref.close();
  }
} 