import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { ProductRegisterComponent } from './page/register/register.component';
import { ProductsComponent } from './page/products/products.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductsRoutes } from './products-routing.module';
import { UploadProductBfComponent } from './page/register/component/upload/upload-bf-product.component';
import { ModalFilterProductComponent } from './component/modal-filter-product/modal-filter-product.component';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductRegisterComponent,
    UploadProductBfComponent,
    ModalFilterProductComponent
  ],
  imports: [ProductsRoutes, MatTooltipModule, SharedModule],
  exports: [ModalFilterProductComponent],
  providers: [],
})
export class ProductsModule {}


