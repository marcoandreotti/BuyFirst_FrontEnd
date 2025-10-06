export interface CatalogThermometerDto {
    catalogId: number;
    name: string;
    startDate: Date;
    expirationDate: Date | null;
    active: boolean;
    blackLists: BlackListThermometerDto[];
    supplier: SupplierThermometerDto;
    catalogProducts: CatalogProductThermometerDto[];
    payments: PaymentThermometerDto[];
    diffVigence: number;
  }
  
  export interface BlackListThermometerDto {
    id: number;
    restrictType: string;
    restrictText: string;
  }
  
  export interface SupplierThermometerDto {
    supplierId: number;
    document: string;
    name: string;
    active: boolean;
    contractAccepted: boolean;
    responsibles: ResponsibleThermometerDto[];
    blackLists: BlackListThermometerDto[];
    regionsTarget: RegionsTargetThermometerDto[];
    payments: PaymentThermometerDto[];
  }
  
  export interface ResponsibleThermometerDto {
    name: string;
    cellphone: string;
    email: string;
    default: boolean;
    type: number;
    typeName: string;
  }
  
  export interface RegionsTargetThermometerDto {
    companyRegionTargetId: number;
    region: RegionThermometerDto;
  }
  
  export interface RegionThermometerDto {
    regionId: number;
    name: string;
    stateAcronym: string;
    active: boolean;
  }
  
  export interface PaymentThermometerDto {
    id: number;
    paymentConditionId: number;
    description: string;
    isEcommerce: boolean;
    paymentTypeActive: boolean;
    paymentConditionActive: boolean;
    percentageOnPrice: number;
    specialConditions: SpecialConditionThermometerDto[];
  }
  
  export interface CatalogProductThermometerDto {
    catalogProductId: number;
    productSupplierLinkId: number;
    deliveryTime: number;
    availableQuantity: number;
    price: number;
    type: number;
    typeText: string;
    active: boolean;
    product: ProductThermometerDto;
    productSupplier: ProductSupplierThermometerDto;
  }
  
  export interface ProductThermometerDto {
    productId: number;
    name: string;
    active: boolean;
    subGroup: SubGroupThermometerDto;
    unitOfMeasure: UnitOfMeasureThermometerDto;
    references: string[];

    moviment: ProductMovimentThermometerDto | any;
  }

  export class ProductMovimentThermometerDto {
    productId: number;
    qtdCompanyCodeSac: number;
    qTdBuyer: number;
    minUnitaryValue: number | null;
    avgUnitaryValue: number | null;
    maxUnitaryValue: number | null;
    lastUnitaryValue: number | null;
    minInvoiceDate: Date | null;
    maxInvoiceDate: Date | null;
    qtdInvoice: number | null;
    qtdProduct: number | null;
  }
  
  export interface SubGroupThermometerDto {
    subGroupId: number;
    name: string;
    active: boolean;
    group: GroupThermometerDto;
  }
  
  export interface GroupThermometerDto {
    groupId: number;
    name: string;
    active: boolean;
  }
  
  export interface UnitOfMeasureThermometerDto {
    unitOfMeasureId: number;
    name: string;
    acronym: string;
  }
  
  export interface ProductSupplierThermometerDto {
    productSupplierId: number;
    name: string;
    externalCode: string;
    referenceCode: string;
    active: boolean;
    brand: BrandThermometerDto;
    unitOfMeasure: UnitOfMeasureThermometerDto;
  }
  
  export interface BrandThermometerDto {
    brandId: number;
    name: string;
    active: boolean;
  }
  
  export interface SpecialConditionThermometerDto {
    id: number;
    paymentConditionCatalogId: number;
    restrictType: string;
    restrictText: string;
    percentageOnPrice: number;
    startDate: Date;
    expirationDate: Date | null;

    diffVigence: number;
  }
  