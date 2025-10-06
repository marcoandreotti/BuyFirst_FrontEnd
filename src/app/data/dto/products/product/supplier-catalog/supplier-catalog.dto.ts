export class SupplierCatalogDto {
    supplierId: number;
    supplierDocument: string;
    supplierName: string;
    products: SupCatProductDto[];
    regions: SupCatRegionDto[];
  }
  
  export class SupCatProductDto {
    productSupplierId: number;
    productName: string;
    acronym: string;
    brandName: string;
    catalogs: SupCatCatalogDto[];
  }
  
  export class SupCatCatalogDto {
    catalogId: number;
    catalogName: string;
    startDate: string;
    expirationDate: string;
    price: number;
    availableQuantity: number;
    payments: SupCatPaymentDto[];
  }
  
  export class SupCatPaymentDto {
    paymentTypeName: string;
    paymentConditionName: string;
    maturityDateType: number;
    daysByPayment: number;
    quantityInstallments: number;
    percentageOnPrice: number;
    paymentConditionSupplierId: number;
    percentagSupplier: number;
    paymentConditionCatalogId: number;
    percentagCatalog: number;
    specials: SupCatSpecialConditionDto[];
    maturityDateTypeDescription: string;
  }
  
  export class SupCatSpecialConditionDto {
    specialConditionSupplierId: number;
    restrictConditionType_Sup: number;
    cnpj_Sup: any;
    regionName_Sup: any;
    percentageOnPrice_Sup: number;
    startDate_Sup: string;
    expirationDate_Sup: any;
    specialConditionCatalogId: number;
    restrictConditionType_Cat: number;
    cnpj_Cat?: string;
    regionName_Cat?: string;
    percentageOnPrice_Cat: number;
    startDate_Cat: string;
    expirationDate_Cat: string;
    restrict_SupDescription: string;
    restrict_CatDescription: string;
  }
  
  export class SupCatRegionDto {
    regionName: string;
    stateAcronym: string;
  }
  