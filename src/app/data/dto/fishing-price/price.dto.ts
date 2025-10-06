export interface PriceDto {
  price: number;
  regionId?: any;
  paymentConditionId: number;
  paymentConditionName: string;
  quantityInstallments: number;
}
