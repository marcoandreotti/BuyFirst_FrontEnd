export class QuoteSolicitationDto {
    quoteSolId: number;
    buyerDocument: string;
    buyerName: string;
    openingDate: Date;
    expectedDate: Date;
    phase: number;
    phaseDescription: string;
    phaseNote: string;

    quantityProducts: number;
    quantityProductsRetry: number;
}