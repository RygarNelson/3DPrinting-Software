import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StampanteLookupFiltri } from 'src/models/stampante/stampante-lookup-filtri';
import { StampanteLookupResponse } from 'src/models/stampante/stampante.lookup';
import { StampanteListingResponse } from '../models/stampante/stampante-listing';
import { StampanteListingFiltri } from '../models/stampante/stampante-listing-filtri';
import { StampanteManagerModel, StampanteManagerResponse } from '../models/stampante/stampante-manager';

@Injectable()
export class StampanteService {

  private api: string = '';

  constructor(private http: HttpClient) {
    const url: URL = new URL(`api/stampante`, environment.baseApi);
        
    this.api = url.toString();
  }

  getLookup(filtri: StampanteLookupFiltri): Observable<StampanteLookupResponse> {
    return this.http.post<StampanteLookupResponse>(`${this.api}/lookup`, filtri);
  }

  getListing(filtri: StampanteListingFiltri): Observable<StampanteListingResponse> {
    return this.http.post<StampanteListingResponse>(`${this.api}/listing`, filtri);
  }

  getStampante(id: number): Observable<StampanteManagerResponse> {
    return this.http.get<StampanteManagerResponse>(`${this.api}/${id}`);
  }

  save(stampante: StampanteManagerModel): Observable<any> {
    return this.http.post(`${this.api}/save`, stampante);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}
