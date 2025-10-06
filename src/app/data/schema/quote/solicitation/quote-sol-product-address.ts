import { Address } from "@data/schema/persons/address";

export class QuoteSolProductAddress {
    quoteSolProductAddressId: number;
    quoteSolProductId: number;
    deliveryAddressId: number;
    address: Address;
    quantity: number;

    //AUX
    concatAddress: string;
}
