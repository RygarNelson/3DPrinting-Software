import { ModelloTipoEnum } from "src/enums/ModelloTipoEnum";
import { ResponseInterface } from "src/interfaces/response.interface";

export class ModelloManagerModel {
    id: number = 0;
    nome: string = '';
    descrizione: string = '';
    tipo: ModelloTipoEnum = ModelloTipoEnum.PLA;
    basetta_dimensione?: string;
    basetta_quantita?: number;
}

export class ModelloManagerResponse implements ResponseInterface {
    success: boolean = false;
    data: ModelloManagerModel = new ModelloManagerModel();
}