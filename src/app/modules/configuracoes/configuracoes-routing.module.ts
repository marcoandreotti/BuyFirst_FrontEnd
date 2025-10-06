import { Routes, RouterModule } from '@angular/router';
import { ConfiguracoesComponent } from './page/configuracoes.component';

const routes: Routes = [
  {
    path: '',
    component: ConfiguracoesComponent
  },
];

export const ConfiguracoesRoutes = RouterModule.forChild(routes);
