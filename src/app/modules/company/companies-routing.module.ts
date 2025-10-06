import { Routes, RouterModule } from '@angular/router';
import { CompanyCodeSacComponent } from './erp/company-code-sac/company-code-sac.component';

const routes: Routes = [
  {
    path: 'analise/:id',
    component: CompanyCodeSacComponent
  },
];

export const CompanyRoutes = RouterModule.forChild(routes);
