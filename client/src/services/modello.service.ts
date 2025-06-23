import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ModelloListingResponse } from 'src/models/modello/modello-listing';
import { ModelloListingFiltri } from 'src/models/modello/modello-listing-filtri';
import { ModelloManagerModel, ModelloManagerResponse } from 'src/models/modello/modello-manager';

@Injectable()
export class ModelloService {
  
  private api: string = '';

  constructor(private http: HttpClient) {
    this.api = `http://localhost:3000/api/modello`;
  }

  getListing(filtri: ModelloListingFiltri): Observable<ModelloListingResponse> {
    return this.http.post<ModelloListingResponse>(`${this.api}/listing`, filtri);
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
}
