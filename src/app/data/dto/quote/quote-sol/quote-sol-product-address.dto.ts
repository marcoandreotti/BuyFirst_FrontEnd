import { AddressDto } from "@data/dto/persons/address.dto";

export class QuoteSolProductAddressDto {
    quoteSolProductAddressId: number;
    quoteSolProductId: number;
    deliveryAddressId: number;
    address: AddressDto;
  }