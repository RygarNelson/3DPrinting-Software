import { SpesaTipoEnum } from "src/enums/SpesaTipoEnum";
import { SpesaUnitaMisuraEnum } from "src/enums/SpesaUnitaMisuraEnum";
import { ResponseInterface } from "src/interfaces/response.interface";

export class SpesaManagerModel {
    id: number = 0;
    data_spesa?: Date;
    totale_spesa?: number;
    descrizione?: string;
    quantita?: number;
    tipo_spesa?: SpesaTipoEnum = SpesaTipoEnum.Resina;
    unita_misura?: SpesaUnitaMisuraEnum = SpesaUnitaMisuraEnum.Lt;
}

export class SpesaManagerResponse implements ResponseInterface {
    success: boolean = false;
    data: SpesaManagerModel = new SpesaManagerModel();
}