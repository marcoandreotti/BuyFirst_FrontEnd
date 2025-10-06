import { ProductErpSupplierCode } from "./product-erp-supplier-code";

export class ProductErp {
    productErpId: number;
    productErpCode: string;
    externalApplicationId: number;
    buyerId: string;
    productName: string;
    unitOfMeasureAcronym: string;
    productErpSupplierCodes: ProductErpSupplierCode[] | any;
    quoteProductErpHistorics: any;
    buyer: any;
    externalApplication: number;
}