import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { VenditaAndamentoResponse } from 'src/models/vendita/vendita-andamento';
import { VenditaAnniResponse } from 'src/models/vendita/vendita-anni';
import { VenditaContoBancarioResponse } from 'src/models/vendita/vendita-conti-bancari';
import { VenditaListingResponse } from 'src/models/vendita/vendita-listing';
import { VenditaListingFiltri } from 'src/models/vendita/vendita-listing-filtri';
import { VenditaManagerModel, VenditaManagerResponse } from 'src/models/vendita/vendita-manager';
import { VenditaRiepilogoModelliResponse } from 'src/models/vendita/vendita-riepilogo-modelli';
import { VenditaStatoResponse } from 'src/models/vendita/vendita-stato';
import { VenditaModificaContoBancarioModel } from 'src/models/vendita/vendita_modifica_conto_bancario';
import { VenditaModificaLinkTracciamentoModel } from 'src/models/vendita/vendita_modifica_link_tracciamento';

@Injectable()
export class VenditaService {

  private api: string = '';

  constructor(private http: HttpClient) {
    const url: URL = new URL(`api/vendita`, environment.baseApi);
        
    this.api = url.toString();
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

  modificaStatoBasetta(id: number, stato_avanzamento?: number): Observable<any> {
    return this.http.post<any>(`${this.api}/basetta/stato/modifica`, {
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

  getRiepilogoModelli(anno: number): Observable<VenditaRiepilogoModelliResponse> {
    return this.http.get<VenditaRiepilogoModelliResponse>(`${this.api}/riepilogo/modelli/${anno}`);
  }

  modificaContoBancarioVendite(request: VenditaModificaContoBancarioModel): Observable<any> {
    return this.http.post<any>(`${this.api}/conto-bancario/modifica`, request);
  }

  modificaLinkTracciamento(request: VenditaModificaLinkTracciamentoModel): Observable<any> {
    return this.http.post<any>(`${this.api}/link-tracciamento/modifica`, request);
  }

  uploadEtichettaSpedizione(venditaId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('etichetta_spedizione', file);
    formData.append('vendita_id', venditaId.toString());
    
    return this.http.post<any>(`${this.api}/${venditaId}/etichetta-spedizione/upload`, formData);
  }

  downloadEtichettaSpedizione(venditaId: number): Observable<Blob> {
    return this.http.get(`${this.api}/${venditaId}/etichetta-spedizione/download`, {
      responseType: 'blob'
    });
  }

  deleteEtichettaSpedizione(venditaId: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/${venditaId}/etichetta-spedizione`);
  }
}
