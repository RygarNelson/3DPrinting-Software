import { ResponseInterface } from "src/interfaces/response.interface";
import { LookupInterface } from "../../interfaces/lookup.interface";

export class StampanteLookup implements LookupInterface {
    id: number = 0;
    etichetta: string = '';
    informazioniAggiuntive?: string;
}

export class StampanteLookupResponse implements ResponseInterface {
    success: boolean = true;
    data: StampanteLookup[] = [];
}
