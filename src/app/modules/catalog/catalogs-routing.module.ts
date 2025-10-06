import { Routes, RouterModule } from '@angular/router';
import { CatalogRegisterComponent } from './page/register/register.component';
import { CatalogProductRegisterComponent } from './page/register/products/register/register.component';
import { CatalogProductsComponent } from './page/register/products/catalog-products.component';
import { CatalogsComponent } from './page/catalogs/catalogs.component';
import { CatalogThermometerComponent } from './page/thermometer/thermometer.component';

const routes: Routes = [
  {
    path: '',
    component: CatalogsComponent,
  },
  {
    path: 'cadastro',
    component: CatalogRegisterComponent,
  },
  {
    path: 'cadastro/:id',
    component: CatalogRegisterComponent,
  },
  {
    path: 'cadastro/:id/produtos',
    component: CatalogProductsComponent,
  },
  {
    path: 'cadastro/:id/produtos/cadastro',
    component: CatalogProductRegisterComponent,
  },
  {
    path: 'cadastro/:id/produtos/cadastro/:idProduct',
    component: CatalogProductRegisterComponent,
  },
  {
    path: 'termometro/:id',
    component: CatalogThermometerComponent,
  },
];

export const CatalogosRoutes = RouterModule.forChild(routes);
