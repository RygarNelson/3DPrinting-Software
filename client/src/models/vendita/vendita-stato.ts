import { ResponseInterface } from "src/interfaces/response.interface";

export class VenditaStatoModel {
    da_stampare: number = 0;
    stampa_in_corso: number = 0;
    terminato_senza_difetti: number = 0;
    terminato_con_difetti: number = 0;
    fallito: number = 0;
    da_controllare: number = 0;
    da_spedire: number = 0;
    spedizione_in_corso: number = 0;
    spedizione_terminata_parzialmente: number = 0;
    spedizione_terminata_completamente: number = 0;
    spedizione_fallita: number = 0;
    in_scadenza: number = 0;
    scadute: number = 0;
}

export class VenditaStatoResponse implements ResponseInterface {
    success: boolean = false;
    data: VenditaStatoModel = new VenditaStatoModel();
}