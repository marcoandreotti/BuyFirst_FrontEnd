import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SalesRoutes } from './sales-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SalesComponent } from './page/sales/sales.component';
import { SaleDetailComponent } from './page/detail/detail.component';
import { PrintOrderComponent } from './page/print-order/print-order.component';

@NgModule({
  declarations: [SalesComponent, SaleDetailComponent, PrintOrderComponent],
  imports: [SalesRoutes, MatTooltipModule, SharedModule],
  providers: [],
})
export class SalesModule {}


