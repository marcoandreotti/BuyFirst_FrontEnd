import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { MatTooltipModule } from '@angular/material/tooltip';
import { FishingPricesRoutes } from './fishing-prices-routing.module';
import { SearchPriceComponent } from './page/search/search-price.component';
import { ModalPricesComponent } from './component/fishing-modal-price/modal-prices.component';

@NgModule({
  declarations: [SearchPriceComponent, ModalPricesComponent],
  imports: [FishingPricesRoutes, MatTooltipModule, SharedModule],
  providers: [],
})
export class FishingPricesModule {}
