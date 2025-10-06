export class ProductLinkErpDto {
    productId: number;
    name: string;
    unitOfMeasureAcronym: string;
    quantityGroupCompanies: number;
    groupName: string;
    subGroupName: string;
    supplierCodes: string;
    quantityMatchesSupplier: number;
    
    // quantityBuyers: number;
    // quantityAllProductsErp: number;
    // quantitySuppliers: number;
    // quantityPossibilities: number;

    //AUX
    selected: boolean | false;

    matchError: boolean | false;

}

export interface GroupErpDto {
    companyCodeSac: number;
    buyers: BuyerProductErpDto[];
    suppliers: SupplierProductErpDto[];
    showSupplier: boolean;
    qtdAddress: boolean;
}

export interface BuyerProductErpDto {
    buyerId: number;
    buyerDocument: string;
    buyerName: string;
    productErpCode: string;
    productErpName: string;
    productErpUnitAcronym: string;
    qtdAddresses: number;
}

export interface SupplierProductErpDto {
    supplierDocument: string;
    supplierName: string;
    supplierProductCode: string;
    supplierProductName: string;
    supplierProductUnitAcronym: string;
}
