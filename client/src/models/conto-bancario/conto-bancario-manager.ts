import { ResponseInterface } from "src/interfaces/response.interface";

export class ContoBancarioManagerModel {
    id: number = 0;
    nome_proprietario: string = '';
    cognome_proprietario: string = '';
    iban: string = '';
}

export class ContoBancarioManagerResponse implements ResponseInterface {
    success: boolean = false;
    data: ContoBancarioManagerModel = new ContoBancarioManagerModel();
}