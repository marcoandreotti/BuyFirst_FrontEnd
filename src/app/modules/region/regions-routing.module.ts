import { Routes, RouterModule } from '@angular/router';
import { RegionRegisterComponent } from './page/register/register.component';
import { RegionsComponent } from './page/regions/regions.component';

const routes: Routes = [
  {
    path: '',
    component: RegionsComponent
  },
  {
    path: 'cadastro',
    component: RegionRegisterComponent
  },
  {
    path: 'cadastro/:id',
    component: RegionRegisterComponent
  }
];

export const RegionRoutes = RouterModule.forChild(routes);
