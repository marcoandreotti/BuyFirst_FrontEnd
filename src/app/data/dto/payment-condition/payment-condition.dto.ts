import { SpecialConditionDto } from "./special-condition.dto";

export class PaymentConditionDto {
  id?: number | null;

  supplierId?: number | null;
  catalogId?: number | null;

  paymentConditionId: number;
  name: string;
  maturityDateType: number;
  maturityDateTypeName: string;
  maturityDateTypeDescription: string;
  daysByPayment: number;
  quantityInstallments: number;
  percentageOnPrice: number;
  active: boolean;

  specialConditions?: SpecialConditionDto[] | null;
}
