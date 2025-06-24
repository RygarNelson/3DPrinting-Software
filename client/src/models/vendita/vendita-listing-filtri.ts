import { VenditaStatoSpedizioneEnum } from "@/enums/VenditaStatoSpedizioneEnum";
import { ListingFilter } from "../../interfaces/listing-filter.interface";

export class VenditaListingFiltri implements ListingFilter {
    search?: string = '';
    limit?: number = 10;
    offset?: number = 0;
    order?: {
        column?: string;
        direction?: string;
    };
    stato_spedizione?: VenditaStatoSpedizioneEnum = undefined;
    cliente_id?: number = 0;
}