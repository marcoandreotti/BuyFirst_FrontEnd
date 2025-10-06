import { Routes, RouterModule } from '@angular/router';
import { SearchPriceComponent } from './page/search/search-price.component';

const routes: Routes = [
  {
    path: '',
    component: SearchPriceComponent,
  },
];

export const FishingPricesRoutes = RouterModule.forChild(routes);
