import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VenditaListingResponse } from 'src/models/vendita/vendita-listing';
import { VenditaListingFiltri } from 'src/models/vendita/vendita-listing-filtri';
import { VenditaManagerModel, VenditaManagerResponse } from 'src/models/vendita/vendita-manager';

@Injectable()
export class VenditaService {

  private api: string = '';

  constructor(private http: HttpClient) {
    this.api = `http://localhost:3000/api/vendita`;
  }

  getListing(filtri: VenditaListingFiltri): Observable<VenditaListingResponse> {
    return this.http.post<VenditaListingResponse>(`${this.api}/listing`, filtri);
  }

  getVendita(id: number): Observable<VenditaManagerResponse> {
    return this.http.get<VenditaManagerResponse>(`${this.api}/${id}`);
  }

  save(vendita: VenditaManagerModel): Observable<any> {
    return this.http.post<any>(`${this.api}`, vendita);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/${id}`);
  }
}
