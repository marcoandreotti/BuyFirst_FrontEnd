export class QuoteErpHistoricAnalytical {
    stateAcronym: string;
    foundRegion: boolean;
    productErpCode: number;
    productName: string;
    unitOfMeasureAcronym: string;
    productId: number;
    startDate?: Date | null;
    endDate?: Date | null;
    quantitySend: number;
    minPrice: number;
    maxPrice: number;
    minQuantity: number;
    maxQuantity: number;
    qtdProductSupplier: number;
    qtdCatalog: number;
    products: QuoteErpHistoricCatalogAnalytical[] | any;

    //Aux
    isDeadline: boolean;
  }
  
  export class QuoteErpHistoricCatalogAnalytical {
    startDateCatalog?: Date | null;
    expirationDateCatalog?: Date | null;
    supplierDocument: string;
    supplierName: string;
    referenceCode: string;
    productSupplierName: string;
    productSupplierNameAcronym: string;
    brandName: string;
    catalogPrice: number;
    availableQuantity: number;
  }
  