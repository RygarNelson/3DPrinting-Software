import { VenditaDettaglioStatoStampaEnum } from "@/enums/VenditaDettaglioStatoStampaEnum";
import { VenditaStatoSpedizioneEnum } from "@/enums/VenditaStatoSpedizioneEnum";
import { ResponseInterface } from "src/interfaces/response.interface";

export class VenditaManagerModel {
    id: number = 0;
    data_vendita?: Date;
    data_scadenza?: Date;
    cliente_id?: number;
    link_tracciamento?: string;
    stato_spedizione?: VenditaStatoSpedizioneEnum;
    dettagli: VenditaDettaglioManagerModel[] = [];
}

export class VenditaDettaglioManagerModel {
    id: number = 0;
    quantita?: number;
    prezzo?: number;
    modello_id?: number;
    vendita_id?: number;
    stampante_id?: number;
    stato_stampa?: VenditaDettaglioStatoStampaEnum;
}

export class VenditaManagerResponse implements ResponseInterface {
    success: boolean = false;
    data: VenditaManagerModel = new VenditaManagerModel();
}