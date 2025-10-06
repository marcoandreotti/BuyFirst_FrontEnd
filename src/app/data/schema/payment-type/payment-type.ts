import { PaymentCondition } from "../payment-conditions/payment-condition";

export class PaymentType {
  paymentTypeId: number;
  name: string;
  description: string;
  isEcommerce: boolean;
  active: boolean;
  paymentConditions: PaymentCondition[] | any;
  
  //AUX
  negociation: string;
}
