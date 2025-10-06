export class OrderSolicitationDto {
    orderSolId: number;
    openingDate: Date;
    supplierDocument: string;
    supplierName: string;
    phase: number;
    phaseDescription: string;
    phaseNote: string;

    quantityProducts: number;
    amount: number;
}