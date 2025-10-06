import { Routes, RouterModule } from '@angular/router';
import { BrandComponent } from './page/brands/brands.component';
import { BrandRegisterComponent } from './page/register/register.component';


const routes: Routes = [
  {
    path: '',
    component: BrandComponent
  },
  {
    path: 'cadastro',
    component: BrandRegisterComponent
  },
  {
    path: 'cadastro/:id',
    component: BrandRegisterComponent
  },
];

export const BrandRoutes = RouterModule.forChild(routes);
