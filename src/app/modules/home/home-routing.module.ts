import { Routes, RouterModule } from '@angular/router';
import { SaleDetailComponent } from '@modules/sale/page/detail/detail.component';
import { PrintOrderComponent } from '@modules/sale/page/print-order/print-order.component';
import { HomeComponent } from './page/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'vendas/detalhe/:id',
    component: SaleDetailComponent,
  },
  {
    path: 'vendas/print-order/:id',
    component: PrintOrderComponent,
  },
];

export const HomeRoutes = RouterModule.forChild(routes);
