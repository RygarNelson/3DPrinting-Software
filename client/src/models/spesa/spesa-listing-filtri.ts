import { ListingFilter } from "../../interfaces/listing-filter.interface";

export class SpesaListingFiltri implements ListingFilter {
    search?: string = '';
    limit?: number = 10;
    offset?: number = 0;
    order?: {
        column?: string;
        direction?: string;
    };
    data_spesa?: {
        value?: Date;
        operator?: string;
    }
    totale_spesa?: {
        value?: number;
        operator?: string;
    }
}