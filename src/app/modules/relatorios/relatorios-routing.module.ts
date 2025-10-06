import { Routes, RouterModule } from '@angular/router';
import { RelatoriosComponent } from './page/relatorios.component';

const routes: Routes = [
  {
    path: '',
    component: RelatoriosComponent
  }
];

export const RelatoriosRoutes = RouterModule.forChild(routes);
