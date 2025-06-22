export interface ListingFilter {
    search?: string;
    limit?: number;
    offset?: number;
    order?: {
        column?: string;
        direction?: string;
    };
}