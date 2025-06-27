import { ModelloTipoEnum } from "src/enums/ModelloTipoEnum";
import { ResponseInterface } from "src/interfaces/response.interface";

export class ModelloListingModel {
    id: number = 0;
    nome: string = '';
    descrizione: string = '';
    updatedAt: Date = new Date();
    isUsed: boolean = false;
    tipo: ModelloTipoEnum = ModelloTipoEnum.PLA;
}

export class ModelloListingResponse implements ResponseInterface {
    success: boolean = true;
    data: ModelloListingModel[] = [];
    count: number = 0;
}