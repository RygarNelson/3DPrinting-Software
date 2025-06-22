import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StampanteListingResponse } from '../models/stampante/stampante-listing';
import { StampanteListingFiltri } from '../models/stampante/stampante-listing-filtri';
import { StampanteManagerModel, StampanteManagerResponse } from '../models/stampante/stampante-manager';

@Injectable()
export class StampanteService {

  private api: string = '';

  constructor(private http: HttpClient) {
    this.api = `http://localhost:3000/api/stampante`;
  }

  /**
   * Get list of printers with filters
   */
  getListing(filtri: StampanteListingFiltri): Observable<StampanteListingResponse> {
    return this.http.post<StampanteListingResponse>(`${this.api}/listing`, filtri);
  }

  /**
   * Get a printer by ID
   */
  getStampante(id: number): Observable<StampanteManagerResponse> {
    return this.http.get<StampanteManagerResponse>(`${this.api}/${id}`);
  }

  /**
   * Save or update a printer
   */
  save(stampante: StampanteManagerModel): Observable<any> {
    console.log(`${this.api}/save`);
    return this.http.post(`${this.api}/save`, stampante);
  }

  /**
   * Delete a printer by ID
   */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}
