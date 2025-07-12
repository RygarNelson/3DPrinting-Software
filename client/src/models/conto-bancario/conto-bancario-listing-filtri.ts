import { ListingFilter } from "../../interfaces/listing-filter.interface";

export class ContoBancarioListingFiltri implements ListingFilter {
    search?: string = '';
    limit?: number = 10;
    offset?: number = 0;
    order?: {
        column?: string;
        direction?: string;
    };
    nome_proprietario?: string;
    cognome_proprietario?: string;
    iban?: string;
}