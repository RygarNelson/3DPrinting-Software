import { VenditaDettaglioStatoStampaEnum } from "@/enums/VenditaDettaglioStatoStampaEnum";
import { VenditaStatoSpedizioneEnum } from "@/enums/VenditaStatoSpedizioneEnum";
import { ResponseInterface } from "src/interfaces/response.interface";

export class VenditaManagerModel {
    id: number = 0;
    data_vendita?: Date;
    data_scadenza?: Date;
    cliente_id?: number;
    link_tracciamento?: string;
    stato_spedizione: VenditaStatoSpedizioneEnum = VenditaStatoSpedizioneEnum.DaSpedire;
    dettagli: VenditaDettaglioManagerModel[] = [];
}

export class VenditaDettaglioManagerModel {
    id: number = 0;
    quantita: number = 0;
    prezzo: number = 0;
    modello_id: number = 0;
    vendita_id: number = 0;
    stampante_id: number = 0;
    stato_stampa: VenditaDettaglioStatoStampaEnum = VenditaDettaglioStatoStampaEnum.DaStampare;
}

export class VenditaManagerResponse implements ResponseInterface {
    success: boolean = false;
    data: VenditaManagerModel = new VenditaManagerModel();
}