import { ResponseInterface } from "src/interfaces/response.interface";
import { LookupInterface } from "../../interfaces/lookup.interface";

export class ClienteLookup implements LookupInterface {
    id: number = 0;
    etichetta: string = '';
    informazioniAggiuntive?: string;
}

export class ClienteLookupResponse implements ResponseInterface {
    success: boolean = true;
    data: ClienteLookup[] = [];
}
