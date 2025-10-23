import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ModelloListingGridResponse, ModelloListingTableResponse } from 'src/models/modello/modello-listing';
import { ModelloListingFiltri } from 'src/models/modello/modello-listing-filtri';
import { ModelloLookupFiltri } from 'src/models/modello/modello-lookup.filtri';
import { ModelloManagerModel, ModelloManagerResponse } from 'src/models/modello/modello-manager';
import { ModelloVintedImpostaInVenditaRequest } from 'src/models/modello/modello-vinted-imposta-in-vendita';
import { ModelloLookupResponse } from 'src/models/modello/modello.lookup';

@Injectable()
export class ModelloService {
  
  private api: string = '';

  constructor(private http: HttpClient) {
    const url: URL = new URL(`api/modello`, environment.baseApi);
        
    this.api = url.toString();
  }

  getLookup(filtri: ModelloLookupFiltri): Observable<ModelloLookupResponse> {
    return this.http.post<ModelloLookupResponse>(`${this.api}/lookup`, filtri);
  }

  getListingTable(filtri: ModelloListingFiltri): Observable<ModelloListingTableResponse> {
    return this.http.post<ModelloListingTableResponse>(`${this.api}/listing/table`, filtri);
  }

  getListingGrid(filtri: ModelloListingFiltri): Observable<ModelloListingGridResponse> {
    return this.http.post<ModelloListingGridResponse>(`${this.api}/listing/grid`, filtri);
  }

  getListingGridNonVinted(filtri: ModelloListingFiltri): Observable<ModelloListingGridResponse> {
    return this.http.post<ModelloListingGridResponse>(`${this.api}/listing/grid-non-vinted`, filtri);
  }

  getModello(id: number): Observable<ModelloManagerResponse> {
    return this.http.get<ModelloManagerResponse>(`${this.api}/${id}`);
  }

  save(modello: ModelloManagerModel): Observable<any> {
    return this.http.post(`${this.api}/save`, modello);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }

  impostaInVenditaVinted(request: ModelloVintedImpostaInVenditaRequest): Observable<any> {
    return this.http.post(`${this.api}/vinted/imposta-in-vendita`, request);
  }
}
