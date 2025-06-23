import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClienteListingResponse } from '../models/cliente/cliente-listing';
import { ClienteListingFiltri } from '../models/cliente/cliente-listing-filtri';
import { ClienteManagerModel, ClienteManagerResponse } from '../models/cliente/cliente-manager';

@Injectable()
export class ClienteService {

  private api: string = '';

  constructor(private http: HttpClient) {
    this.api = `http://localhost:3000/api/cliente`;
  }

  /**
   * Get list of clients with filters
   */
  getListing(filtri: ClienteListingFiltri): Observable<ClienteListingResponse> {
    return this.http.post<ClienteListingResponse>(`${this.api}/listing`, filtri);
  }

  /**
   * Get a client by ID
   */
  getCliente(id: number): Observable<ClienteManagerResponse> {
    return this.http.get<ClienteManagerResponse>(`${this.api}/${id}`);
  }

  /**
   * Save or update a client
   */
  save(cliente: ClienteManagerModel): Observable<any> {
    return this.http.post(`${this.api}/save`, cliente);
  }

  /**
   * Delete a client by ID
   */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
} 