import { ShoppingCartSupplier } from "./shopping-cart-supplier";

export interface ShoppingCart {
  buyerId: number;
  addressDeliveryId: number;
  addressBillingAddressId: number;
  shoppingCartSuppliers: ShoppingCartSupplier[];
  shoppingCartId: number;
}

