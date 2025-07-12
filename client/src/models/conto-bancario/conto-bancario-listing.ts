import { ResponseInterface } from "src/interfaces/response.interface";

export class ContoBancarioListingModel {
    id: number = 0;
    nome_proprietario: string = '';
    cognome_proprietario: string = '';
    iban: string = '';
    isUsed: boolean = false;
}

export class ContoBancarioListingResponse implements ResponseInterface {
    success: boolean = true;
    data: ContoBancarioListingModel[] = [];
    count: number = 0;
}