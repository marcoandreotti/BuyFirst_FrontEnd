import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductErpRoutes } from './product-erp-routing.module';
import { ProductLinkErpComponent } from './pages/product-link-erp/product-link-erp.component';
import { ProductErpAnalysisComponent } from './pages/analysis/product-erp-analysis.component';
import { ModalFilterProductErpComponent } from './component/modal-filter-product-erp/modal-filter-product-erp.component';
import { ModalLinkProductErpComponent } from './component/modal-link-product-erp/modal-link-product-erp.component';

@NgModule({
  declarations: [ProductLinkErpComponent, ProductErpAnalysisComponent, ModalFilterProductErpComponent, ModalLinkProductErpComponent],
  imports: [
    ProductErpRoutes,
    MatTooltipModule,
    SharedModule,
  ],
  exports: [ModalFilterProductErpComponent, ModalLinkProductErpComponent],
  providers: [],
})
export class ProductErpModule { }

