import { ResponseInterface } from "src/interfaces/response.interface";

export class StampanteManagerModel {
    id: number = 0;
    nome: string = '';
    descrizione: string = '';
}

export class StampanteManagerResponse implements ResponseInterface {
    success: boolean = false;
    data: StampanteManagerModel = new StampanteManagerModel();
}