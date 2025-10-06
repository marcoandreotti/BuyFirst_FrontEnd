import { Routes, RouterModule } from '@angular/router';
import { OrderSolicitationsComponent } from './page/order-solicitations/order-solicitations.component';

const routes: Routes = [
  {
    path: '',
    component: OrderSolicitationsComponent,
  }
];

export const OrderSolicitationRoutes = RouterModule.forChild(routes);
