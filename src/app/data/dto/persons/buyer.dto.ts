import { CNPJPipe } from "ng-brazil/cnpj/pipe";
import { Address } from "../../schema/persons/address";

export class BuyerDto {
  buyerId: number;
  deliveryAddress: Address;
  billingAddress: Address;
  active: boolean;
  document: string | CNPJPipe;
  name: string;
  stateRegistration: string;
  tradingName: string;
  type: number;
}
