import { ResponseInterface } from "src/interfaces/response.interface";

export class ClienteManagerModel {
    id: number = 0;
    nome: string = '';
    cognome: string = '';
    ragione_sociale: string = '';
    email: string = '';
    telefono: string = '';
}

export class ClienteManagerResponse implements ResponseInterface {
    success: boolean = false;
    data: ClienteManagerModel = new ClienteManagerModel();
} 