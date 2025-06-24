import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClienteLookupFiltri } from 'src/models/cliente/cliente-looku-filtri';
import { ClienteLookupResponse } from 'src/models/cliente/cliente-lookup';
import { ClienteListingResponse } from '../models/cliente/cliente-listing';
import { ClienteListingFiltri } from '../models/cliente/cliente-listing-filtri';
import { ClienteManagerModel, ClienteManagerResponse } from '../models/cliente/cliente-manager';

@Injectable()
export class ClienteService {

  private api: string = '';

  constructor(private http: HttpClient) {
    this.api = `http://localhost:3000/api/cliente`;
  }

  getLookup(filtri: ClienteLookupFiltri): Observable<ClienteLookupResponse> {
    return this.http.post<ClienteLookupResponse>(`${this.api}/lookup`, filtri);
  }

  getListing(filtri: ClienteListingFiltri): Observable<ClienteListingResponse> {
    return this.http.post<ClienteListingResponse>(`${this.api}/listing`, filtri);
  }

  getCliente(id: number): Observable<ClienteManagerResponse> {
    return this.http.get<ClienteManagerResponse>(`${this.api}/${id}`);
  }

  save(cliente: ClienteManagerModel): Observable<any> {
    return this.http.post(`${this.api}/save`, cliente);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
} 