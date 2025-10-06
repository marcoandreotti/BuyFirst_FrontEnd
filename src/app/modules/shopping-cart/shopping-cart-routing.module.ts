import { Routes, RouterModule } from '@angular/router';
import { DetailShoppingComponent } from './page/detail-shopping/detail-shopping.component';

const routes: Routes = [
  {
    path: '',
    component: DetailShoppingComponent,
  },
];

export const DetailShoppingRoutes = RouterModule.forChild(routes);
