import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CatalogosRoutes } from './catalogs-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UploadProductComponent } from './page/register/products/register/component/upload/upload-product.component';
import { CatalogsComponent } from './page/catalogs/catalogs.component';
import { CatalogRegisterComponent } from './page/register/register.component';
import { CatalogProductsComponent } from './page/register/products/catalog-products.component';
import { CatalogProductRegisterComponent } from './page/register/products/register/register.component';
import { ModalCatalogConfigComponent } from './components/modal-config/modal-config.component';
import { ModalCatalogConfigPaymentComponent } from './components/modal-catalog-config-payment/modal-catalog-config-payment.component';
import { CatalogThermometerComponent } from './page/thermometer/thermometer.component';
import { CatalogModalWaitingQueueComponent } from './page/register/products/register/component/catalog-waiting-queue-modal/catalog-waiting-queue-modal.component';

@NgModule({
  declarations: [
    CatalogsComponent,
    CatalogRegisterComponent,
    CatalogThermometerComponent,
    CatalogProductsComponent,
    CatalogProductRegisterComponent,
    UploadProductComponent,
    ModalCatalogConfigComponent,
    ModalCatalogConfigPaymentComponent,
    CatalogModalWaitingQueueComponent,
  ],
  imports: [CatalogosRoutes, MatTooltipModule, SharedModule],
  providers: [],
  exports: [ModalCatalogConfigComponent, ModalCatalogConfigPaymentComponent, CatalogModalWaitingQueueComponent],
})
export class CatalogsModule {}
