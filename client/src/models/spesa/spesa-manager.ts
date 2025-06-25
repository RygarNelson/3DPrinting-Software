import { ResponseInterface } from "src/interfaces/response.interface";

export class SpesaManagerModel {
    id: number = 0;
    data_spesa?: Date;
    totale_spesa?: number;
    descrizione?: string;
}

export class SpesaManagerResponse implements ResponseInterface {
    success: boolean = false;
    data: SpesaManagerModel = new SpesaManagerModel();
}