import { ProductErpSupplierCode } from "./product-erp-supplier-code";

export class ProductErpSupplierMatch {
    supplierDocument: string;
    supplierProductCode: string;
    supplierName: string;
    supplierProductName: string;
    productId?: number | null;
    productBuyFirstName?: string | null;
    active: boolean;
    productErpSupplierCodes: ProductErpSupplierCode[];
}