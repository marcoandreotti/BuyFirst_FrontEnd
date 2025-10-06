import { Routes, RouterModule } from '@angular/router';
import { MatchConfirmComponent } from './component/match-confirm/match-confirm.component';
import { MatchAnalysisComponent } from './pages/analysis/match-analysis.component';
import { ProductMatchComponent } from './pages/matchs/product-match.component';

const routes: Routes = [
  {
    path: '',
    component: ProductMatchComponent,
  },
  {
    path: 'match-confirm/:id',
    component: MatchConfirmComponent,
  },
  {
    path: 'matchanalysis',
    component: MatchAnalysisComponent,
  },
];

export const ProductMatchRoutes = RouterModule.forChild(routes);
