import { AddressDto } from "@data/dto/persons/address.dto"
import { QuoteSolProductDto } from "./quote-sol-product.dto"

export class QuoteSolDto {
    quoteSolId: number;
    buyerId: number;
    deliveryAddressId: number;
    externalApplicationId: number;
    openingDate: string;
    expectedDate: string;
    phase: number;
    phaseNote: string;

    products: QuoteSolProductDto[];
    buyerName: string;
    deliveryAddress: AddressDto;
  }