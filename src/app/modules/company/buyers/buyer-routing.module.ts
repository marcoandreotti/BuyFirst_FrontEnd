import { Routes, RouterModule } from '@angular/router';
import { BuyerAnalysisComponent } from './page/buyer-analysis/buyer-analysis.component';
import { BuyersComponent } from './page/buyers/buyers.component';
import { BuyerRegisterComponent } from './page/register/register.component';

const routes: Routes = [
  {
    path: '',
    component: BuyersComponent,
  },
  {
    path: 'cadastro',
    component: BuyerRegisterComponent,
  },
  {
    path: 'cadastro/:id',
    component: BuyerRegisterComponent,
  },
  {
    path: 'analise/:id/:prodErpCode',
    component: BuyerAnalysisComponent,
  },
];

export const BuyerRoutes = RouterModule.forChild(routes);
