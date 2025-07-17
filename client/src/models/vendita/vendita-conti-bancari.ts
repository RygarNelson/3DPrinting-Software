import { ResponseInterface } from "src/interfaces/response.interface";

export class VenditaContoBancarioModel {
    id: number = 0;
    iban: string = '';
    totale_vendite: number = 0;
}

export class VenditaContoBancarioResponse implements ResponseInterface {
    success: boolean = true;
    data: VenditaContoBancarioModel[] = [];
}