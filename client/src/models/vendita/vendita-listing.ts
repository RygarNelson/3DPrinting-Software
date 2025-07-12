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
    cliente: VenditaListingClienteModel = new VenditaListingClienteModel();
    conto_bancario: VenditaListingContoBancarioModel = new VenditaListingContoBancarioModel();
    dettagli: VenditaListingDettaglioModel[] = [];
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

export class VenditaListingResponse implements ResponseInterface {
    success: boolean = true;
    data: VenditaListingModel[] = [];
    count: number = 0;
    ultimiTreMesi: number = 0;
    ultimiTreMesiSospese: number = 0;
}