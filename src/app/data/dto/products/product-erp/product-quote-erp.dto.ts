export class GroupProductsQuoteErpDto {
    companyCodeSac:number;
    products: ProductsQuoteErpDto[] | any;
}

export class ProductsQuoteErpDto {
    productErpCode:number;
    productName: string;
    unitOfMeasureAcronym: string;
    stateAcronym?: string | null;
    foundRegion: boolean
    quantityBuyer: number | null;
    quantitySupplier: number | null;
    quantityQuote: number | null;
    quantitySend?: number | null;
}



