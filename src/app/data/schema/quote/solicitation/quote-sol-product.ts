import { QuoteSolProductAddress } from "./quote-sol-product-address";
import { QuoteSolProductBrand } from "./quote-sol-product-brand";
import { QuoteSolProductRetry } from "./quote-sol-product-retry";

export class QuoteSolProduct {
    quoteSolProductId: number;
    quoteSolId: number;
    subGroupId: number;
    productSearch: string;
    quantity: number;
    referenceCodeSearch: string;
    brands: QuoteSolProductBrand[] | any;
    unitOfMeasureId: number;
    
    phase: number;
    phaseNote?: string | null;

    productRetries: QuoteSolProductRetry[];
    deliveryAddresses: QuoteSolProductAddress[];
    
    //AUX
    groupSearch: string;
    unitOfMeasureAcronym: string;
}
