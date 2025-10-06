export class QuoteErpHistoricDto {
    externalApplicationId: number;
    companyCodeSac: number;
    productErpCode: number;
    productName: string;
    unitOfMeasureAcronym: string;
    productId: any;
    averageQuantity: number;
    averagePrice: number;
    quantitySend: number;
    quantityBuyer: number;
    quantityQuote: number;
    quantitySupplier: number;
    quantityCatalog: number;
    foundOrder: boolean;
    foundRegion: boolean;
    
    //AUX
    selected: boolean | false;
}