import { ProductSupplierLink } from "@data/schema/products/products-supplier/product-supplier-link";

export class CatalogProduct {
  catalogProductId: number;
  catalogId: number;
  deliveryTime: number;
  initialQuantity: number;
  availableQuantity: number;
  salesMinimumQuantity: number;
  salesMaximumQuantity: number;
  productSupplierLinkId: number;
  price: number;
  minimumPrice?: number;
  maximumPrice?: number;
  active: boolean;
  catalog?: any;
  productSupplierLink: ProductSupplierLink;
  createdBy: string;
  created: Date;
  lastModifiedBy?: any;
  lastModified?: any;
  type: number | 1;

  note: string | null;
}
