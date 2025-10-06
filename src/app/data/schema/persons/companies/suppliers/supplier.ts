import { CompanyBase } from "../company";

export class Supplier extends CompanyBase {
  supplierId: number;
  regionsIds: number[] | any;
  minimumBillingAmount: number | 0;
}
