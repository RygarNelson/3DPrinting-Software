import { ResponseInterface } from "src/interfaces/response.interface";
import { LookupInterface } from "../../interfaces/lookup.interface";

export class ModelloLookup implements LookupInterface {
    id: number = 0;
    etichetta: string = '';
    informazioniAggiuntive?: string;
}

export class ModelloLookupResponse implements ResponseInterface {
    success: boolean = true;
    data: ModelloLookup[] = [];
}
