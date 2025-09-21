import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ContoBancarioListingResponse } from 'src/models/conto-bancario/conto-bancario-listing';
import { ContoBancarioListingFiltri } from 'src/models/conto-bancario/conto-bancario-listing-filtri';
import { ContoBancarioLookupResponse } from 'src/models/conto-bancario/conto-bancario-lookup';
import { ContoBancarioLookupFiltri } from 'src/models/conto-bancario/conto-bancario-lookup.filtri';
import { ContoBancarioManagerModel, ContoBancarioManagerResponse } from 'src/models/conto-bancario/conto-bancario-manager';

@Injectable()
export class ContoBancarioService {
  
  private api: string = '';

  constructor(private http: HttpClient) {
    const url: URL = new URL(`api/conto-bancario`, environment.baseApi);
    
    this.api = url.toString();
  }

  getLookup(filtri: ContoBancarioLookupFiltri): Observable<ContoBancarioLookupResponse> {
    return this.http.post<ContoBancarioLookupResponse>(`${this.api}/lookup`, filtri);
  }

  getListing(filtri: ContoBancarioListingFiltri): Observable<ContoBancarioListingResponse> {
    return this.http.post<ContoBancarioListingResponse>(`${this.api}/listing`, filtri);
  }

  getContoBancario(id: number): Observable<ContoBancarioManagerResponse> {
    return this.http.get<ContoBancarioManagerResponse>(`${this.api}/${id}`);
  }

  save(contoBancario: ContoBancarioManagerModel): Observable<any> {
    return this.http.post(`${this.api}/save`, contoBancario);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}
