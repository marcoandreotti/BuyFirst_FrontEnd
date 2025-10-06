import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '@shared/shared.module';
import { ModalFilterQuoteErpComponent } from './component/modal-filter-quote-erp/modal-filter-quote-erp.component';
import { ModalLinkQuoteErpComponent } from './component/modal-link-quote-erp/modal-link-quote-erp.component';
import { QuoteErpHistoricComponent } from './quote-erp-historic/quote-erp-historic.component';
import { QuotesRoutes } from './quotes-routing.module';

@NgModule({
  declarations: [QuoteErpHistoricComponent, ModalFilterQuoteErpComponent, ModalLinkQuoteErpComponent],
  imports: [QuotesRoutes, MatTooltipModule, SharedModule],
  providers: [],
  exports: [ModalFilterQuoteErpComponent, ModalLinkQuoteErpComponent],
})
export class QuotesModule {}
