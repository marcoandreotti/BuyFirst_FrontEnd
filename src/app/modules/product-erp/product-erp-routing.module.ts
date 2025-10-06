import { Routes, RouterModule } from '@angular/router';
import { ProductErpAnalysisComponent } from './pages/analysis/product-erp-analysis.component';
import { ProductLinkErpComponent } from './pages/product-link-erp/product-link-erp.component';

const routes: Routes = [
  {
    path: '',
    component: ProductLinkErpComponent
  },
  {
    path: 'analise/:productId',
    component: ProductErpAnalysisComponent
  }
];

export const ProductErpRoutes = RouterModule.forChild(routes);
