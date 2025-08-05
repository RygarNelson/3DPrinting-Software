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
    SkeletonModule
  ],
  templateUrl: './audit-log.component.html',
  providers: [LogService, DialogService]
})
export class AuditLogComponent implements OnInit, OnDestroy {
  logs: AuditLog[] = [];
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

  close(): void {
    this.ref.close();
  }
} 