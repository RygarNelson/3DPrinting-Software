import { ResponseInterface } from "src/interfaces/response.interface";

export class ModelloManagerModel {
    id: number = 0;
    nome: string = '';
    descrizione: string = '';
}

export class ModelloManagerResponse implements ResponseInterface {
    success: boolean = false;
    data: ModelloManagerModel = new ModelloManagerModel();
}