import { ProductErp } from "./product-erp";

export class ProductErpSupplierCode {
    productErpSupplierCodeId: number;
    productErpId: number;
    supplierId?: number | null;
    supplierDocument: string;
    supplierProductCode: string;
    brandName: string;
    purchaseDate?: Date | null;
    price?: number | 0;
    productSupplierLinkId: number;
    productSupplierLink: any;
    productErp: ProductErp;
    supplier: any;
}