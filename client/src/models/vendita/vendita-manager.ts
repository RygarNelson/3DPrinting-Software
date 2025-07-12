import { VenditaDettaglioStatoStampaEnum } from "src/enums/VenditaDettaglioStatoStampaEnum";
import { VenditaStatoSpedizioneEnum } from "src/enums/VenditaStatoSpedizioneEnum";
import { ResponseInterface } from "src/interfaces/response.interface";

export class VenditaManagerModel {
    id: number = 0;
    data_vendita?: Date;
    data_scadenza?: Date;
    data_scadenza_spedizione?: Date;
    cliente_id?: number;
    conto_bancario_id?: number;
    link_tracciamento?: string;
    stato_spedizione?: VenditaStatoSpedizioneEnum = VenditaStatoSpedizioneEnum.DaSpedire;
    dettagli: VenditaDettaglioManagerModel[] = [];
}

export class VenditaDettaglioManagerModel {
    id: number = 0;
    quantita?: number;
    prezzo?: number;
    modello_id?: number;
    vendita_id?: number;
    stampante_id?: number;
    stato_stampa?: VenditaDettaglioStatoStampaEnum = VenditaDettaglioStatoStampaEnum.DaStampare;
}

export class VenditaManagerResponse implements ResponseInterface {
    success: boolean = false;
    data: VenditaManagerModel = new VenditaManagerModel();
}