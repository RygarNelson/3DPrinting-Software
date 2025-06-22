import { ResponseInterface } from "src/interfaces/response.interface";

export class StampanteListingModel {
    id: number = 0;
    nome: string = '';
    descrizione: string = '';
}

export class StampanteListingResponse implements ResponseInterface {
    success: boolean = true;
    data: StampanteListingModel[] = [];
    count: number = 0;
}