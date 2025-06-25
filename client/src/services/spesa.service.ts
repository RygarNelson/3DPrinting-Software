import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpesaListingResponse } from 'src/models/spesa/spesa-listing';
import { SpesaListingFiltri } from 'src/models/spesa/spesa-listing-filtri';
import { SpesaManagerModel, SpesaManagerResponse } from 'src/models/spesa/spesa-manager';

@Injectable()
export class SpesaService {

  private api: string = '';

  constructor(private http: HttpClient) {
    this.api = `http://localhost:3000/api/spesa`;
  }

  getListing(filtri: SpesaListingFiltri): Observable<SpesaListingResponse> {
    return this.http.post<SpesaListingResponse>(`${this.api}/listing`, filtri);
  }

  getSpesa(id: number): Observable<SpesaManagerResponse> {
    return this.http.get<SpesaManagerResponse>(`${this.api}/${id}`);
  }

  save(spesa: SpesaManagerModel): Observable<any> {
    return this.http.post(`${this.api}/save`, spesa);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}
