import { Routes, RouterModule } from '@angular/router';
import { ProductRegisterComponent } from './page/register/register.component';
import { ProductsComponent } from './page/products/products.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent
  },
  {
    path: 'cadastro',
    component: ProductRegisterComponent
  },
  {
    path: 'cadastro/:id',
    component: ProductRegisterComponent
  }
];

export const ProductsRoutes = RouterModule.forChild(routes);
