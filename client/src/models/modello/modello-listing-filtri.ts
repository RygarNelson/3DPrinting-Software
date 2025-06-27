import { ModelloTipoEnum } from "src/enums/ModelloTipoEnum";
import { ListingFilter } from "../../interfaces/listing-filter.interface";

export class ModelloListingFiltri implements ListingFilter {
    search?: string = '';
    limit?: number = 10;
    offset?: number = 0;
    order?: {
        column?: string;
        direction?: string;
    };
    tipo?: ModelloTipoEnum;
}