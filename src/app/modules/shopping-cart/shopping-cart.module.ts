import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { MatTooltipModule } from '@angular/material/tooltip';
import { DetailShoppingComponent } from './page/detail-shopping/detail-shopping.component';
import { DetailShoppingRoutes } from './shopping-cart-routing.module';
import { CartProductComponent } from '@modules/shopping-cart/component/cart-product/cart-product.component';

@NgModule({
  declarations: [DetailShoppingComponent, CartProductComponent],
  imports: [DetailShoppingRoutes, MatTooltipModule, SharedModule],
  providers: [],
  exports: [CartProductComponent],
})
export class DetailShoppingModule {}
