import { ResponseInterface } from "src/interfaces/response.interface";

export class SpesaListingModel {
    id: number = 0;
    data_spesa: Date = new Date();
    totale_spesa: number = 0;
    descrizione: string = '';
}

export class SpesaListingResponse implements ResponseInterface {
    success: boolean = true;
    data: SpesaListingModel[] = [];
    count: number = 0;
}