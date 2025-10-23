import { VenditaDettaglioStatoStampaEnum } from "src/enums/VenditaDettaglioStatoStampaEnum";
import { VenditaStatoSpedizioneEnum } from "src/enums/VenditaStatoSpedizioneEnum";
import { ResponseInterface } from "src/interfaces/response.interface";

export class VenditaListingModel {
    id: number = 0;
    data_vendita?: Date;
    data_scadenza?: Date;
    data_scadenza_spedizione?: Date;
    totale_vendita: number = 0;
    isInScadenza: boolean = false;
    isScaduto: boolean = false;
    stato_spedizione: VenditaStatoSpedizioneEnum = VenditaStatoSpedizioneEnum.DaSpedire;
    link_tracciamento?: string;
    cliente: VenditaListingClienteModel = new VenditaListingClienteModel();
    conto_bancario: VenditaListingContoBancarioModel = new VenditaListingContoBancarioModel();
    dettagli: VenditaListingDettaglioModel[] = [];
    basette: VenditaListingDettaglioBasettaModel[] = [];
}

export class VenditaListingClienteModel {
    etichetta: string = '';
}

export class VenditaListingDettaglioModel {
    id: number = 0;
    quantita: number = 0;
    prezzo: number = 0;
    stato_stampa: VenditaDettaglioStatoStampaEnum = VenditaDettaglioStatoStampaEnum.DaStampare;
    modello: VenditaListingDettaglioModelloModel = new VenditaListingDettaglioModelloModel();
    stampante: VenditaListingDettaglioStampanteModel = new VenditaListingDettaglioStampanteModel();
    descrizione?: string;
    stampa_is_pezzo_singolo: boolean = false;
    stampa_is_parziale: boolean = false;
}

export class VenditaListingDettaglioModelloModel {
    nome: string = '';
}

export class VenditaListingDettaglioStampanteModel {
    nome: string = '';
}

export class VenditaListingContoBancarioModel {
    iban: string = '';
}

export class VenditaListingDettaglioBasettaModel {
    id: number = 0;
    dimensione: string = '';
    quantita: number = 0;
    stato_stampa: VenditaDettaglioStatoStampaEnum = VenditaDettaglioStatoStampaEnum.DaStampare;
}

export class VenditaListingResponse implements ResponseInterface {
    success: boolean = true;
    data: VenditaListingModel[] = [];
    count: number = 0;
    ultimiTreMesi: number = 0;
    ultimiTreMesiSospese: number = 0;
}