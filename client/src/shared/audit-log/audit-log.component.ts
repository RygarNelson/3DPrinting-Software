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
import { GroupClientInfoPipe } from '../pipes/group-client-info.pipe';
import { GroupTimestampPipe } from '../pipes/group-timestamp.pipe';
import { GroupUserPipe } from '../pipes/group-user.pipe';
import { OperationLabelPipe } from '../pipes/operation-label.pipe';
import { OperationSeverityPipe } from '../pipes/operation-severity.pipe';
import { PrettyJsonPipe } from '../pipes/pretty-json.pipe';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [CommonModule, TableModule, CardModule, ButtonModule, TagModule, TooltipModule, SkeletonModule, PrettyJsonPipe, GroupTimestampPipe, GroupTimestampPipe, GroupClientInfoPipe, OperationLabelPipe, OperationSeverityPipe, GroupUserPipe],
  templateUrl: './audit-log.component.html',
  styleUrl: './audit-log.component.scss',
  providers: [LogService, DialogService]
})
export class AuditLogComponent implements OnInit, OnDestroy {
  logs: AuditLog[] = [];
  groupedLogs: { [key: number]: AuditLog[] } = {};
  groupedLogKeys: number[] = [];
  collapsedGroups: { [key: number]: boolean } = {};
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
    this.subscription = this.logService.getLogsForRecord(tableName, recordId).subscribe({
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

  private groupLogsByGroupId(): void {
    this.groupedLogs = {};

    // Group logs by group_id
    this.logs.forEach((log) => {
      if (!this.groupedLogs[log.group_id]) {
        this.groupedLogs[log.group_id] = [];
      }
      this.groupedLogs[log.group_id].push(log);
    });

    // Sort groups by the most recent log in each group (descending)
    this.groupedLogKeys = Object.keys(this.groupedLogs)
      .map((key) => Number(key))
      .sort((a, b) => {
        const aLatest = Math.max(...this.groupedLogs[a].map((log) => new Date(log.createdAt).getTime()));
        const bLatest = Math.max(...this.groupedLogs[b].map((log) => new Date(log.createdAt).getTime()));
        return bLatest - aLatest;
      });

    // Sort logs within each group by creation date (oldest first to show progression)
    Object.keys(this.groupedLogs).forEach((groupId) => {
      this.groupedLogs[Number(groupId)].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    });

    // Initialize all groups as collapsed
    this.initializeCollapsedState();
  }

  private initializeCollapsedState(): void {
    this.groupedLogKeys.forEach((groupId) => {
      this.collapsedGroups[groupId] = true; // Start all groups collapsed
    });
  }

  toggleGroup(groupId: number): void {
    this.collapsedGroups[groupId] = !this.collapsedGroups[groupId];
  }

  isGroupCollapsed(groupId: number): boolean {
    return this.collapsedGroups[groupId] ?? true;
  }

  expandAllGroups(): void {
    this.groupedLogKeys.forEach((groupId) => {
      this.collapsedGroups[groupId] = false;
    });
  }

  collapseAllGroups(): void {
    this.groupedLogKeys.forEach((groupId) => {
      this.collapsedGroups[groupId] = true;
    });
  }

  close(): void {
    this.ref.close();
  }

  getChanges(log: AuditLog): { key: string; old: any; new: any }[] {
    if (log.operation !== 'UPDATE') {
      return [];
    }

    // Legacy format: field_name is present
    if (log.field_name) {
      return [
        {
          key: log.field_name,
          old: log.old_value,
          new: log.new_value
        }
      ];
    }

    // New aggregated format: parse JSON from old_value and new_value
    try {
      const oldValues = log.old_value ? JSON.parse(log.old_value) : {};
      const newValues = log.new_value ? JSON.parse(log.new_value) : {};

      const keys = new Set([...Object.keys(oldValues), ...Object.keys(newValues)]);
      const changes: { key: string; old: any; new: any }[] = [];

      keys.forEach((key) => {
        changes.push({
          key: key,
          old: oldValues[key],
          new: newValues[key]
        });
      });

      return changes;
    } catch (e) {
      console.error('Error parsing update log values:', e);
      return [];
    }
  }

  getSingleChange(log: AuditLog): { key: string; old: any; new: any } | null {
    const changes = this.getChanges(log);
    return changes.length === 1 ? changes[0] : null;
  }
}
