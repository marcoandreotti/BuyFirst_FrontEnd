import { PaymentConditionDto } from "./payment-condition.dto";

export class PaymentTypeDto {
  paymentTypeId: number;
  name: string;
  description: string;
  isEcommerce: boolean;
  paymentConditions: PaymentConditionDto[] | any;
}
