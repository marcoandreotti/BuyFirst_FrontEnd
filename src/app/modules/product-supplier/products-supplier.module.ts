import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductsSupplierRoutes } from './products-supplier-routing.module';
import { ProductsSupplierComponent } from './page/products-supplier/products-supplier.component';
import { ProductSupplierRegisterComponent } from './page/register/register.component';
import { UploadProductSupplierComponent } from './page/register/component/upload/upload-supplier-product.component';
import { BrandModalComponent } from './page/register/component/brand-modal/brand-modal.component';
import { ModalWaitingQueueComponent } from './page/register/component/waiting-queue-modal/waiting-queue-modal.component';

@NgModule({
  declarations: [
    ProductsSupplierComponent,
    ProductSupplierRegisterComponent,
    UploadProductSupplierComponent,
    BrandModalComponent,
    ModalWaitingQueueComponent,
  ],
  imports: [ProductsSupplierRoutes, MatTooltipModule, SharedModule],
  providers: [],
  exports: [BrandModalComponent, ModalWaitingQueueComponent],
})
export class ProductsSupplierModule {}

