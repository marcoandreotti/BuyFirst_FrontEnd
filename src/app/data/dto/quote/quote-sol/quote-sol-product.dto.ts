import { QuoteSolProductAddressDto } from "./quote-sol-product-address.dto"
import { QuoteSolProductRetryDto } from "./quote-sol-product-retry.dto"

export class QuoteSolProductDto {
    quoteSolProductId: number;
    quoteSolId: number;
    subGroupId: number;
    productSearch: string;
    quantity: number;
    unitOfMeasureId: number;
    referenceCodeSearch: string;
    brandSearch: string;

    phase: number;
    phaseNote: string;

    groupSearch: string;
    unitOfMeasureAcronym: string;
    productRetries: QuoteSolProductRetryDto[] | any;
    deliveryAddresses: QuoteSolProductAddressDto[] | any;

    //Aux
    showProductRetries: boolean | false;
    showDeliveryAddresses: boolean | false;
  }