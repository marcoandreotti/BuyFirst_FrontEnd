export class ProductAnalysisDto {
    productId: number;
    productName: string;
    unitOfMeasureId: number;
    unitOfMeasureAcronym: string;
    groupId: number;
    groupName: string;
    subGroupId: number;
    subGroupName: string;
    quantityCodeSac: number;
    quantityQuote: number;
    quantityOrder: number;
    quantityCatalog: number;
    quantitySupplier: number;
    active: boolean;
    allowDeletion: boolean;
    referencesCode: string
    
    //AUX
    selected: boolean | false;
  }
  