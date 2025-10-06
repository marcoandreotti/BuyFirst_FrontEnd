import { ProductSupplier } from "./product-supplier";

export class ProductSupplierLink {
  productSupplierLinkId: number;
  productId: number;
  productSupplierId: number;
  product?: any;
  productSupplier: ProductSupplier;
}
