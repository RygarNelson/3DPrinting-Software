import { Graph } from "src/interfaces/graph";
import { ResponseInterface } from "src/interfaces/response.interface";

export class VenditaAndamentoResponse implements ResponseInterface {
    success: boolean = true;
    data: Graph = {};
    totaleVendite: number = 0;
    totaleSpese: number = 0;
}