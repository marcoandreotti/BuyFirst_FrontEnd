import { Routes, RouterModule } from '@angular/router';
import { ProductSupplierRegisterComponent } from './page/register/register.component';
import { ProductsSupplierComponent } from './page/products-supplier/products-supplier.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsSupplierComponent
  },
  {
    path: 'cadastro',
    component: ProductSupplierRegisterComponent
  },
  {
    path: 'cadastro/:id',
    component: ProductSupplierRegisterComponent
  }

];

export const ProductsSupplierRoutes = RouterModule.forChild(routes);
