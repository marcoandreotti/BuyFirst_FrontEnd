import { Routes, RouterModule } from '@angular/router';
import { PaymentRegisterComponent } from './page/register/register.component';
import { PaymentComponent } from './page/payments/payments.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentComponent
  },
  {
    path: 'cadastro',
    component: PaymentRegisterComponent
  },
  {
    path: 'cadastro/:id',
    component: PaymentRegisterComponent
  }
];

export const PaymentsRoutes = RouterModule.forChild(routes);
