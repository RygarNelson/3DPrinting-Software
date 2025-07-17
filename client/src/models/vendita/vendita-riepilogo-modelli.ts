import { ModelloTipoEnum } from "src/enums/ModelloTipoEnum";
import { ResponseInterface } from "src/interfaces/response.interface";

export class VenditaRiepilogoModelli {
    mese_numero: number = 0;
    mese: string = '';
    modello_nome: string = '';
    tipo: ModelloTipoEnum = ModelloTipoEnum.PLA;
    quantita: number = 0;
    prezzo_totale: number = 0;
}

export class VenditaRiepilogoModelliResponse implements ResponseInterface {
    success: boolean = false;
    data: VenditaRiepilogoModelli[] = [];
}