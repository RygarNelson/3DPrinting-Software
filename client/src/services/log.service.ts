import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface AuditLog {
  id: number;
  table_name: string;
  record_id: number;
  operation: string;
  field_name?: string;
  old_value?: any;
  new_value?: any;
  old_record?: any;
  new_record?: any;
  additional_data?: any;
  ip_address?: string;
  user_agent?: string;
  createdAt: string;
  updatedAt: string;
  group_id: number;
  user: {
    id: number;
    name: string;
    surname: string;
    email: string;
  };
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

  private api = ``;

  constructor(private http: HttpClient) {
    const url: URL = new URL(`api/logs`, environment.baseApi);
        
    this.api = url.toString();
  }

  /**
   * Get logs with filters and pagination
   */
  getLogs(filters: AuditLogFilters = {}): Observable<AuditLogResponse> {
    return this.http.post<AuditLogResponse>(this.api, filters);
  }

  /**
   * Get logs for a specific record (non-paginated)
   */
  getLogsForRecord(tableName: string, recordId: number): Observable<AuditLogResponse> {
    // For Vendita logs, use the enriched endpoint that includes dettagli and basette
    if (tableName === 'T_VENDITE') {
      return this.getEnrichedVenditaLogs(recordId);
    }
    
    // For all other table types, use the standard endpoint
    let filters: AuditLogFilters = {
      table_name: tableName,
      record_id: recordId,
      limit: 1000,
      offset: 0
    }
    return this.http.post<AuditLogResponse>(this.api, filters);
  }

  /**
   * Get enriched Vendita logs including dettagli and basette information
   */
  private getEnrichedVenditaLogs(recordId: number): Observable<AuditLogResponse> {
    const filters = {
      table_name: 'T_VENDITE',
      record_id: recordId,
      limit: 1000,
      offset: 0
    };
    return this.http.post<AuditLogResponse>(`${this.api}/vendita/enriched`, filters);
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

    return this.http.get<any>(`${this.api}/statistics`, { params });
  }

  /**
   * Get a specific log entry by ID
   */
  getLogById(id: number): Observable<{ success: boolean; data: AuditLog }> {
    return this.http.get<{ success: boolean; data: AuditLog }>(`${this.api}/${id}`);
  }
} 