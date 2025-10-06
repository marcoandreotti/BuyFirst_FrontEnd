import { CompanyBase } from "../company";

export class Buyer extends CompanyBase {
  buyerId: number;
  regionsIds: number[] | any;
  minimumBillingAmount: number | 0;
}
