import { ResponseInterface } from "src/interfaces/response.interface";

export class ClienteListingModel {
    id: number = 0;
    etichetta: string = '';
    email: string = '';
    telefono: string = '';
    updatedAt?: string = '';
}

export class ClienteListingResponse implements ResponseInterface {
    success: boolean = true;
    data: ClienteListingModel[] = [];
    count: number = 0;
} 