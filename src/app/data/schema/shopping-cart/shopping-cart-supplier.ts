import { ShoppingCartProduct } from "./shopping-cart-product";

export interface ShoppingCartSupplier {
  shoppingCartSupplierId: number;
  shoppingCartId: number;
  supplierId: number;
  paymentConditionId: number;
  products: ShoppingCartProduct[];
}
