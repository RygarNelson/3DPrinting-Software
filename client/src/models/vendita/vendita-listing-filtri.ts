import { VenditaDettaglioStatoStampaEnum } from "src/enums/VenditaDettaglioStatoStampaEnum";
import { VenditaStatoSpedizioneEnum } from "src/enums/VenditaStatoSpedizioneEnum";
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
    stato_stampa?: VenditaDettaglioStatoStampaEnum = undefined;
    cliente_id?: number = 0;
    data_vendita?: {
        value?: Date;
        operator?: string;
    }
    data_scadenza?: {
        value?: Date;
        operator?: string;
    }
    totale_vendita?: {
        value?: number;
        operator?: string;
    }
}