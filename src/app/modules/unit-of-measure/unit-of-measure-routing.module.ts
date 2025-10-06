import { Routes, RouterModule } from '@angular/router';
import { CadastroUnitOfMeasureComponent } from './page/cadastro/cadastro-unit-of-measure.component';
import { UnitOfMeasureComponent } from './page/unit-of-measure/unit-of-measure.component';

const routes: Routes = [
  {
    path: '',
    component: UnitOfMeasureComponent
  },
  {
    path: 'cadastro',
    component: CadastroUnitOfMeasureComponent
  },
  {
    path: 'cadastro/:id',
    component: CadastroUnitOfMeasureComponent
  }
];

export const UnitOfMeasureRoutes = RouterModule.forChild(routes);
