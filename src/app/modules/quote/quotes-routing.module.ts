import { Routes, RouterModule } from '@angular/router';
import { QuoteErpHistoricComponent } from './quote-erp-historic/quote-erp-historic.component';
const routes: Routes = [
  {
    path: 'erp',
    component: QuoteErpHistoricComponent,
  }
];

export const QuotesRoutes = RouterModule.forChild(routes);
