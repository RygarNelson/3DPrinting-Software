import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AuditLog {
  id: number;
  table_name: string;
  record_id: number;
  operation: string;
  user_id: number;
  user_name?: string;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  createdAt: string;
  updatedAt: string;
  group_id: number;
}

export interface AuditLogResponse {
  success: boolean;
  data: AuditLog[];
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    pages: number;
  };
}

export interface AuditLogFilters {
  table_name?: string;
  record_id?: number;
  operation?: string;
  user_id?: number;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
  order?: string;
}

@Injectable()
export class LogService {
  private apiUrl = `http://localhost:3000/api/logs`;

  constructor(private http: HttpClient) {}

  /**
   * Get logs with filters and pagination
   */
  getLogs(filters: AuditLogFilters = {}): Observable<AuditLogResponse> {
    return this.http.post<AuditLogResponse>(this.apiUrl, filters);
  }

  /**
   * Get logs for a specific record (non-paginated)
   */
  getLogsForRecord(tableName: string, recordId: number): Observable<AuditLogResponse> {
    let filters: AuditLogFilters = {
      table_name: tableName,
      record_id: recordId,
      limit: 1000,
      offset: 0
    }
    return this.http.post<AuditLogResponse>(this.apiUrl, filters);
  }

  /**
   * Get log statistics
   */
  getLogStatistics(filters: AuditLogFilters = {}): Observable<any> {
    let params = new HttpParams();
    
    Object.keys(filters).forEach(key => {
      const value = filters[key as keyof AuditLogFilters];
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<any>(`${this.apiUrl}/statistics`, { params });
  }

  /**
   * Get a specific log entry by ID
   */
  getLogById(id: number): Observable<{ success: boolean; data: AuditLog }> {
    return this.http.get<{ success: boolean; data: AuditLog }>(`${this.apiUrl}/${id}`);
  }
} 