export class PaymentCondition {
  paymentConditionId: number;
  name: string;
  maturityDateType: number;
  maturityDateTypeName: string;
  maturityDateTypeDescription: string;
  daysByPayment: number;
  quantityInstallments: number;
  paymentTypeId: number;
  percentageOnPrice: number;
  active: boolean;
}
