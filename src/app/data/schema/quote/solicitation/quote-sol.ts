import { Address } from "@data/schema/persons/address";
import { QuoteSolProduct } from "./quote-sol-product";

export class QuoteSol {
    quoteSolId: number;
    buyerId: number;
    deliveryAddressId: number;
    paymentConditionSupplierId: number;
    externalApplicationId: number;
    externalCode?: string | null;
    openingDate: string;
    note?: string | null;
    expectedDate: string;
    externalPhase: number;
    phase: number;
    products: QuoteSolProduct[];

    //Aux
    buyerName: string;
    deliveryAddress: Address;
}