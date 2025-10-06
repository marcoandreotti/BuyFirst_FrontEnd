import { Routes, RouterModule } from '@angular/router';
import { SupplierRegisterComponent } from './page/register/register.component';
import { SuppliersComponent } from './page/suppliers/suppliers.component';

const routes: Routes = [
  {
    path: '',
    component: SuppliersComponent
  },
  {
    path: 'cadastro',
    component: SupplierRegisterComponent
  },
  {
    path: 'cadastro/:id',
    component: SupplierRegisterComponent
  },
];

export const SupplierRoutes = RouterModule.forChild(routes);
