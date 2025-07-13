import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VenditaAndamentoResponse } from 'src/models/vendita/vendita-andamento';
import { VenditaAnniResponse } from 'src/models/vendita/vendita-anni';
import { VenditaContoBancarioResponse } from 'src/models/vendita/vendita-conti-bancari';
import { VenditaListingResponse } from 'src/models/vendita/vendita-listing';
import { VenditaListingFiltri } from 'src/models/vendita/vendita-listing-filtri';
import { VenditaManagerModel, VenditaManagerResponse } from 'src/models/vendita/vendita-manager';
import { VenditaStatoResponse } from 'src/models/vendita/vendita-stato';

@Injectable()
export class VenditaService {

  private api: string = '';

  constructor(private http: HttpClient) {
    this.api = `http://localhost:3000/api/vendita`;
  }

  getAnni(): Observable<VenditaAnniResponse> {
    return this.http.get<VenditaAnniResponse>(`${this.api}/anni`);
  }

  getAndamentoVendite(anno: number): Observable<VenditaAndamentoResponse> {
    return this.http.get<VenditaAndamentoResponse>(`${this.api}/andamento/${anno}`);
  }

  getListing(filtri: VenditaListingFiltri): Observable<VenditaListingResponse> {
    return this.http.post<VenditaListingResponse>(`${this.api}/listing`, filtri);
  }

  getVendita(id: number): Observable<VenditaManagerResponse> {
    return this.http.get<VenditaManagerResponse>(`${this.api}/vendita/${id}`);
  }

  save(vendita: VenditaManagerModel): Observable<any> {
    return this.http.post<any>(`${this.api}/save`, vendita);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/${id}`);
  }

  modificaStatoDettaglio(id: number, stato_avanzamento?: number): Observable<any> {
    return this.http.post<any>(`${this.api}/dettaglio/stato/modifica`, {
      id,
      stato_avanzamento
    });
  }

  modificaStatoVendita(id: number, stato_avanzamento?: number): Observable<any> {
    return this.http.post<any>(`${this.api}/vendita/stato/modifica`, {
      id,
      stato_avanzamento
    });
  }

  getStatoVendite(): Observable<VenditaStatoResponse> {
    return this.http.get<VenditaStatoResponse>(`${this.api}/stato`);
  }

  getStatoContiBancari(anno: number): Observable<VenditaContoBancarioResponse> {
    return this.http.get<VenditaContoBancarioResponse>(`${this.api}/conti-bancari/${anno}`);
  }
}
