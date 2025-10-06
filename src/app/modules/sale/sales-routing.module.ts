import { Routes, RouterModule } from '@angular/router';
import { SaleDetailComponent } from './page/detail/detail.component';
import { SalesComponent } from './page/sales/sales.component';
import { PrintOrderComponent } from './page/print-order/print-order.component';

const routes: Routes = [
  {
    path: '',
    component: SalesComponent,
  },
  {
    path: 'detalhe/:id',
    component: SaleDetailComponent,
  },
  {
    path: 'print-order/:id',
    component: PrintOrderComponent,
  }
];

export const SalesRoutes = RouterModule.forChild(routes);
