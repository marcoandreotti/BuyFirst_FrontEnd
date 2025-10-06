export interface MyOrderDto {
    orderId: number;
    externalCode: string;
    openingDate: Date;
    supplierId: number;
    supplierName: string;
    supplierDocument: string;
    buyerId: number;
    buyerName: string;
    buyerDocument: string;
    addressDeliveryId: number;
    paymentConditionId: number;
    paymentConditionName: string;
    totalOrder: number;
    overallStatusId: number;
    alias: string;
    statusName: string;
  }
  