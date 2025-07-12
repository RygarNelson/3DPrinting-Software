import { ResponseInterface } from "src/interfaces/response.interface";
import { LookupInterface } from "../../interfaces/lookup.interface";

export class ContoBancarioLookup implements LookupInterface {
    id: number = 0;
    etichetta: string = '';
    informazioniAggiuntive?: string;
}

export class ContoBancarioLookupResponse implements ResponseInterface {
    success: boolean = true;
    data: ContoBancarioLookup[] = [];
}
