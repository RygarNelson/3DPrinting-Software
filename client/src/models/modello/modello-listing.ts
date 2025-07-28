import { ModelloTipoEnum } from "src/enums/ModelloTipoEnum";
import { ResponseInterface } from "src/interfaces/response.interface";

export class ModelloListingTableModel {
    id: number = 0;
    nome: string = '';
    descrizione: string = '';
    updatedAt: Date = new Date();
    isUsed: boolean = false;
    tipo: ModelloTipoEnum = ModelloTipoEnum.PLA;
    basetta_dimensione?: string;
    basetta_quantita?: number;
}

export class ModelloListingGridModel {
    id: number = 0;
    nome: string = '';
    descrizione: string = '';
    updatedAt: Date = new Date();
    isUsed: boolean = false;
    tipo: ModelloTipoEnum = ModelloTipoEnum.PLA;
    basetta_dimensione?: string;
    basetta_quantita?: number;
    vinted_is_in_vendita?: boolean;
}

export class ModelloListingTableResponse implements ResponseInterface {
    success: boolean = true;
    data: ModelloListingTableModel[] = [];
    count: number = 0;
}

export class ModelloListingGridResponse implements ResponseInterface {
    success: boolean = true;
    data: ModelloListingGridModel[] = [];
    count: number = 0;
}