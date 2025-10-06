import { ProductMatchDto } from "./product-match.dto";
import { ProductSupplierMatchDto } from "./product-supplier-match.dto";

export class ConfirmMatchDto {
  productId: number;
  productSupplierId: number;

  productSupplier: ProductSupplierMatchDto;
  product: ProductMatchDto;

  public constructor(init?: Partial<ConfirmMatchDto>) {
    Object.assign(this, init);
  }
}
